import { CameraPositionType, PicturePoint } from './../../../../shared/models/maps.model'

export class LoadPicturesPoint {
  static readonly type = '[Imajbox - Pictures] Load picture point'
  constructor(public payload: { position: GeoJSON.Position; distance: number }) {}
}

export class LoadPicturesPointSuccess {
  static readonly type = '[Imajbox - Pictures] Load picture point Success'
  constructor(public payload: PicturePoint) {}
}

export class LoadPicturesPointFailure {
  static readonly type = '[Imajbox - Pictures] Load picture point Failure'
  constructor(public payload: { error: any; distance: number }) {}
}

export class ChangeCameraPosition {
  static readonly type = '[Imajbox - Pictures] Change camera position'
  constructor(public payload: CameraPositionType) {}
}
