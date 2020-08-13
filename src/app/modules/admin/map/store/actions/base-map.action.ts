import { BaseMap } from './../../models/base-map.model'

export class LoadBaseMap {
  static readonly type = '[Base Map] Load'
}

export class LoadBaseMapSuccess {
  static readonly type = '[Base Map] Load Success'
  constructor(public payload: BaseMap) {}
}

export class LoadBaseMapFailure {
  static readonly type = '[Base Map] Load Failure'
  constructor(public payload: any) {}
}

export class ChangeMapStyle {
  static readonly type = '[Base Map] Change Map Style'
  constructor(public payload: string) {}
}

export class CloneActiveMapInPreviousMap {
  static readonly type = '[Base Map] clone active map in previous map'
  constructor(public payload: Partial<BaseMap>) {}
}
