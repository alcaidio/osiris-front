import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { NotificationService } from '../../../../shared/services/notification.service'
import { PictureService } from '../../services/picture.service'
import { ID, Picture, PicturePoint } from './../../../../shared/models'
import { CameraPositionType } from './../../../../shared/models/maps.model'
import {
  ChangeCameraPosition,
  LoadPicturesPoint,
  LoadPicturesPointFailure,
  LoadPicturesPointSuccess,
} from './pictures.action'

export interface PicturesStateModel {
  ids: ID[]
  entities: {
    [id: string]: PicturePoint
  }
  selectedPointId: number | null
  selectedCamera: CameraPositionType
  loading: boolean
  error: string | null
}

export const picturesStateDefaults: PicturesStateModel = {
  ids: [],
  entities: {},
  selectedPointId: null,
  selectedCamera: 'front',
  loading: false,
  error: null,
}

@State<PicturesStateModel>({
  name: 'imajboxPictures',
  defaults: picturesStateDefaults,
})
@Injectable()
export class PicturesState {
  constructor(private pictureService: PictureService, private notification: NotificationService) {}

  @Selector()
  static getSelectedPicturesPoint(state: PicturesStateModel): PicturePoint {
    return state.selectedPointId && state.entities[state.selectedPointId]
  }

  @Selector()
  static getSelectedPicture(state: PicturesStateModel): Picture {
    const picturePoint = state.entities[state.selectedPointId]
    return picturePoint.pictures.find((images: Picture) => images.camera === state.selectedCamera)
  }

  @Action(LoadPicturesPoint)
  load({ dispatch, patchState }: StateContext<PicturesStateModel>, action: LoadPicturesPoint) {
    patchState({
      loading: true,
    })
    const distance = action.payload.distance
    return this.pictureService.getImageByLngLat(action.payload.position, distance.toString()).pipe(
      map((picturePoint: PicturePoint) => dispatch(new LoadPicturesPointSuccess(picturePoint))),
      catchError((error) => {
        dispatch(new LoadPicturesPointFailure({ error, distance }))
        return of(error)
      })
    )
  }

  @Action(LoadPicturesPointSuccess)
  loadSuccess({ patchState, getState }: StateContext<PicturesStateModel>, action: LoadPicturesPointSuccess) {
    const state = getState()
    patchState({
      ids: [...state.ids, action.payload.id],
      entities: { ...state.entities, [action.payload.id]: action.payload },
      selectedPointId: action.payload.id,
      loading: false,
    })
  }

  @Action(LoadPicturesPointFailure)
  loadFailure({ patchState }: StateContext<PicturesStateModel>, action: LoadPicturesPointFailure) {
    patchState({
      error: action.payload.error,
      loading: false,
    })
    this.notification.openSnackBar(`Aucun point n'a été trouvé dans un rayon de ${action.payload.distance}m.`)
  }

  @Action(ChangeCameraPosition)
  changeCameraPosition({ patchState }: StateContext<PicturesStateModel>, action: ChangeCameraPosition) {
    patchState({
      selectedCamera: action.payload,
    })
  }
}
