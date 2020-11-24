import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { NotificationService } from '../../../../shared/services/notification.service'
import { PictureService } from '../../services/picture.service'
import { ID, Picture, PicturePoint } from './../../../../shared/models'
import { CameraPositionType } from './../../../../shared/models/maps.model'
import {
  ChangeCameraPosition,
  GoToNeighbour,
  LoadPicturesPointById,
  LoadPicturesPointByLngLat,
  LoadPicturesPointFailure,
  LoadPicturesPointSuccess,
  SwitchCameraPosition,
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
  constructor(
    private pictureService: PictureService,
    private notification: NotificationService,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  @Selector()
  static getSelectedPicturesPoint(state: PicturesStateModel): PicturePoint {
    return state.selectedPointId && state.entities[state.selectedPointId]
  }

  @Selector()
  static getSelectedPicture(state: PicturesStateModel): Picture {
    const picturePoint = state.entities[state.selectedPointId]
    return picturePoint.pictures.find((images: Picture) => images.camera === state.selectedCamera)
  }

  @Action(LoadPicturesPointByLngLat)
  loadbyLngLat({ dispatch, patchState }: StateContext<PicturesStateModel>, action: LoadPicturesPointByLngLat) {
    patchState({
      loading: true,
    })
    const distance = action.payload.distance
    const position = action.payload.position
    return this.pictureService.getImageByLngLat(position, distance.toString()).pipe(
      map((picturePoint: PicturePoint) => {
        dispatch(new LoadPicturesPointSuccess(picturePoint))
        this.store.dispatch(
          new Navigate([], { point: picturePoint.id }, { queryParamsHandling: 'merge', relativeTo: this.route })
        )
      }),
      catchError((error) => {
        dispatch(new LoadPicturesPointFailure({ error, distance }))
        return of(error)
      })
    )
  }

  @Action(LoadPicturesPointById)
  loadById({ dispatch, patchState }: StateContext<PicturesStateModel>, action: LoadPicturesPointById) {
    patchState({
      loading: true,
    })
    return this.pictureService.getImageById(+action.payload).pipe(
      map((picturePoint: PicturePoint) => dispatch(new LoadPicturesPointSuccess(picturePoint))),
      catchError((error) => {
        dispatch(new LoadPicturesPointFailure({ error }))
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
    if (action.payload.distance) {
      this.notification.openSnackBar(`Aucun point n'a été trouvé dans un rayon de ${action.payload.distance}m.`)
    } else {
      this.notification.openSnackBar('Aucun point disponible', 'X', 1500)
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

  @Action(SwitchCameraPosition)
  switchCameraPosition({ patchState }: StateContext<PicturesStateModel>, action: SwitchCameraPosition) {
    let camera: CameraPositionType
    switch (action.payload) {
      case 'front':
        camera = 'back'
        break
      case 'back':
        camera = 'front'
        break
      case 'right':
        camera = 'left'
        break
      case 'left':
        camera = 'right'
        break
      case 'front-right':
        camera = 'back-left'
        break
      case 'front-left':
        camera = 'back-right'
        break
      case 'back-right':
        camera = 'front-left'
        break
      case 'back-left':
        camera = 'front-right'
        break
    }
    patchState({
      selectedCamera: camera,
    })
    this.store.dispatch(new Navigate([], { camera }, { queryParamsHandling: 'merge', relativeTo: this.route }))
  }

  @Action(SwitchCameraPosition)
  switchCameraPosition({ patchState }: StateContext<PicturesStateModel>, action: SwitchCameraPosition) {
    let camera: CameraPositionType
    switch (action.payload) {
      case 'front':
        camera = 'back'
        break
      case 'back':
        camera = 'front'
        break
      case 'right':
        camera = 'left'
        break
      case 'left':
        camera = 'right'
        break
      case 'front-right':
        camera = 'back-left'
        break
      case 'front-left':
        camera = 'back-right'
        break
      case 'back-right':
        camera = 'front-left'
        break
      case 'back-left':
        camera = 'front-right'
        break
    }
    patchState({
      selectedCamera: camera,
    })
  }

  @Action(GoToNeighbour)
  goToNeighbour({ dispatch, getState }: StateContext<PicturesStateModel>, action: GoToNeighbour) {
    const state = getState()
    const pointId = state.entities[state.selectedPointId].neighbours[action.payload]
    dispatch(new LoadPicturesPointById(pointId))
    this.store.dispatch(new Navigate([], { point: pointId }, { queryParamsHandling: 'merge', relativeTo: this.route }))
  }
}
