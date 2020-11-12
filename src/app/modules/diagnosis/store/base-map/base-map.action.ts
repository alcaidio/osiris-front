import { BaseMap, ID, MapConfig } from '../../../../shared/models'

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

export class ToggleOverlay {
  static readonly type = '[Diagnosis - Base Map] Toggle overlay'
  constructor(public payload: ID) {}
}

export class ChangeBaseLayer {
  static readonly type = '[Diagnosis - Base Map] Change current base layer'
  constructor(public payload: string) {}
}
