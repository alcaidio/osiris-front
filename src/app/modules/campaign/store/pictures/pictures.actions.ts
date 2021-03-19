import { ID } from 'app/shared/models'
import { LatLng } from 'leaflet'
import { CameraPositionType, NeighboursDirectionType, PicturePoint } from '../../model/campaign.model'

export class LoadPicturesPointByLngLat {
  static readonly type = '[Campaign - Pictures] Load picture point by lnglat'
  constructor(public payload: { position: LatLng; distance: number }) {}
}

export class LoadPicturesPointById {
  static readonly type = '[Campaign - Pictures] Load picture point by id'
  constructor(public payload: ID) {}
}

export class LoadPicturesPointSuccess {
  static readonly type = '[Campaign - Pictures] Load picture point Success'
  constructor(public payload: PicturePoint) {}
}

export class LoadPicturesPointFailure {
  static readonly type = '[Campaign - Pictures] Load picture point Failure'
  constructor(public payload: { error: any; pointId: number; distance?: number }) {}
}

export class ChangeCameraPosition {
  static readonly type = '[Campaign - Pictures] Change camera position'
  constructor(public payload: CameraPositionType) {}
}

export class SwitchCameraPosition {
  static readonly type = '[Campaign - Pictures] Switch camera position'
  constructor(public payload: CameraPositionType) {}
}

export class GoToNeighbour {
  static readonly type = '[Campaign - Pictures] Go to neighbour'
  constructor(public payload: NeighboursDirectionType) {}
}
