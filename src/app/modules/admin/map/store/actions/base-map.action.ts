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

export class SaveBaseMapConfig {
  static readonly type = '[Base Map] save map config'
  constructor(public payload: Partial<BaseMap>) {}
}
