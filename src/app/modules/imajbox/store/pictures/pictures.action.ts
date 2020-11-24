import { ID } from 'app/shared/models'
import { CameraPositionType, NeighboursDirectionType, PicturePoint } from './../../../../shared/models/maps.model'

export class LoadPicturesPointByLngLat {
  static readonly type = '[Imajbox - Pictures] Load picture point by lnglat'
  constructor(public payload: { position: GeoJSON.Position; distance: number }) {}
}

export class LoadPicturesPointById {
  static readonly type = '[Imajbox - Pictures] Load picture point by id'
  constructor(public payload: ID) {}
}

export class LoadPicturesPointSuccess {
  static readonly type = '[Imajbox - Pictures] Load picture point Success'
  constructor(public payload: PicturePoint) {}
}

export class LoadPicturesPointFailure {
  static readonly type = '[Imajbox - Pictures] Load picture point Failure'
  constructor(public payload: { error: any; distance?: number }) {}
}

export class ChangeCameraPosition {
  static readonly type = '[Imajbox - Pictures] Change camera position'
  constructor(public payload: CameraPositionType) {}
}

export class SwitchCameraPosition {
  static readonly type = '[Imajbox - Pictures] Switch camera position'
  constructor(public payload: CameraPositionType) {}
}

export class GoToNeighbour {
  static readonly type = '[Imajbox - Pictures] Go to neighbour'
  constructor(public payload: NeighboursDirectionType) {}
}
