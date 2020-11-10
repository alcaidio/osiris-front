import { BaseMap, MapConfig } from '../../../../shared/models/maps.model'

export class LoadBaseMap {
  static readonly type = '[Diagnosis - Base Map] Load'
}

export class LoadBaseMapSuccess {
  static readonly type = '[Diagnosis - Base Map] Load Success'
  constructor(public payload: BaseMap) {}
}

export class LoadBaseMapFailure {
  static readonly type = '[Diagnosis - Base Map] Load Failure'
  constructor(public payload: any) {}
}

export class SetMapConfig {
  static readonly type = '[Diagnosis - Base Map] Set map config'
  constructor(public payload: Partial<MapConfig>) {}
}

export class ToggleLayer {
  static readonly type = '[Diagnosis - Base Map] Toggle layer'
  constructor(public payload: string) {}
}

export class ChangeBaseLayer {
  static readonly type = '[Diagnosis - Base Map] Change current base layer'
  constructor(public payload: string) {}
}
