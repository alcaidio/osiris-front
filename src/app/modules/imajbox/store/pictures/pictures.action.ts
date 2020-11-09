import { CameraPositionType, PicturePoint } from './../../../../shared/models/maps.model'

export class LoadPicturesPoint {
  static readonly type = '[Imajbox - Pictures] Load picture point'
  constructor(public payload: GeoJSON.Position) {}
}

export class LoadPicturesPointSuccess {
  static readonly type = '[Imajbox - Pictures] Load picture point Success'
  constructor(public payload: PicturePoint) {}
}

export class LoadPicturesPointFailure {
  static readonly type = '[Imajbox - Pictures] Load picture point Failure'
  constructor(public payload: any) {}
}

export class ChangeCameraPosition {
  static readonly type = '[Imajbox - Pictures] Change camera position'
  constructor(public payload: CameraPositionType) {}
}
