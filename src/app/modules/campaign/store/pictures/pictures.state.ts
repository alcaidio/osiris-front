import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { NotificationService } from '../../../../shared/services/notification.service'
import { CameraPositionType, ID, Picture, PicturePoint } from '../../model/campaign.model'
import { ApiService } from '../../services/api.service'
import { OpenViewer } from './../ui/ui.actions'
import {
  ChangeCameraPosition,
  GoToNeighbour,
  LoadPicturesPointById,
  LoadPicturesPointByLngLat,
  LoadPicturesPointFailure,
  LoadPicturesPointSuccess,
} from './pictures.actions'

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
  name: 'pictures',
  defaults: picturesStateDefaults,
})
@Injectable()
export class PicturesState {
  constructor(
    private api: ApiService,
    private notification: NotificationService,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  @Selector()
  static getLoading(state: PicturesStateModel): boolean {
    return state.loading
  }

  @Selector()
  static getSelectedPicturesPoint(state: PicturesStateModel): PicturePoint {
    return state.selectedPointId && state.entities[state.selectedPointId]
  }

  @Selector()
  static getSelectedPicture(state: PicturesStateModel): Picture {
    const picturePoint = state.entities[state.selectedPointId]
    return picturePoint.pictures.find((images: Picture) => images.camera === state.selectedCamera)
  }

  @Selector()
  static getCameraConfig(state: PicturesStateModel): any {
    const picturePoint = state.entities[state.selectedPointId]
    if (picturePoint) {
      const selectedPicture = picturePoint.pictures.find((images: Picture) => images.camera === state.selectedCamera)
      if (selectedPicture) {
        return { position: picturePoint.geom.coordinates, rotation: selectedPicture.direction }
      }
    }
  }

  @Action(LoadPicturesPointByLngLat)
  loadbyLngLat({ dispatch, patchState }: StateContext<PicturesStateModel>, action: LoadPicturesPointByLngLat) {
    patchState({
      loading: true,
    })
    const { distance, position } = action.payload
    let pointId
    return this.api.getImageByLngLat(position, distance.toString()).pipe(
      map((picturePoint: PicturePoint) => {
        dispatch(new LoadPicturesPointSuccess(picturePoint))
        this.store.dispatch(
          new Navigate([], { point: picturePoint.id }, { queryParamsHandling: 'merge', relativeTo: this.route })
        )
        pointId = picturePoint.id
      }),
      catchError((error) => {
        dispatch(new LoadPicturesPointFailure({ error, pointId, distance }))
        return of(error)
      })
    )
  }

  @Action(LoadPicturesPointById)
  loadById({ dispatch, patchState, getState }: StateContext<PicturesStateModel>, action: LoadPicturesPointById) {
    patchState({
      loading: true,
    })
    const id = +action.payload
    const picturePoint = getState().entities[id]

    if (picturePoint) {
      return dispatch(new LoadPicturesPointSuccess(picturePoint))
    } else {
      return this.api.getImageById(id).pipe(
        map((p: PicturePoint) => dispatch(new LoadPicturesPointSuccess(p))),
        catchError((err) => {
          dispatch(new LoadPicturesPointFailure({ error: err, pointId: id }))
          return of(err)
        })
      )
    }
  }

  @Action(LoadPicturesPointSuccess)
  loadSuccess({ patchState, getState, dispatch }: StateContext<PicturesStateModel>, action: LoadPicturesPointSuccess) {
    const state = getState()
    const id = action.payload.id
    patchState({
      ids: state.ids.indexOf(id) === -1 ? [...state.ids, id] : [...state.ids],
      entities: { ...state.entities, [id]: action.payload },
      selectedPointId: id,
      loading: false,
    })
    dispatch(new OpenViewer())
  }

  @Action(LoadPicturesPointFailure)
  loadFailure({ patchState }: StateContext<PicturesStateModel>, action: LoadPicturesPointFailure) {
    patchState({
      error: action.payload.error,
      loading: false,
    })
    const { distance, pointId } = action.payload
    if (distance) {
      this.notification.openSnackBar(`Aucune image n'a été trouvée dans un rayon de ${distance}m.`)
    } else {
      if (pointId) {
        this.notification.openSnackBar(`Le point "${pointId}" n'est pas disponible`, 'X', 1500)
      } else {
        this.notification.openSnackBar('Aucun point disponible', 'X', 1500)
      }
    }
  }

  @Action(ChangeCameraPosition)
  changeCameraPosition({ patchState }: StateContext<PicturesStateModel>, action: ChangeCameraPosition) {
    patchState({
      selectedCamera: action.payload,
    })
    this.store.dispatch(
      new Navigate([], { camera: action.payload }, { queryParamsHandling: 'merge', relativeTo: this.route })
    )
  }

  @Action(GoToNeighbour)
  goToNeighbour({ dispatch, getState }: StateContext<PicturesStateModel>, action: GoToNeighbour) {
    const state = getState()
    const pointId = state.entities[state.selectedPointId].neighbours[action.payload]
    dispatch(new LoadPicturesPointById(pointId))
    this.store.dispatch(new Navigate([], { point: pointId }, { queryParamsHandling: 'merge', relativeTo: this.route }))
  }
}
