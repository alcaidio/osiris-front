import { BaseMap } from './../../models/base-map.model'

export class MapIsLoaded {
  static readonly type = '[Base Map] Map render and load'
}

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

export class GetActiveMap {
  static readonly type = '[Base Map] Get active map'
  constructor(public payload: Partial<BaseMap>) {}
}

export class SaveActiveMap {
  static readonly type = '[Base Map] Save map'
}

export class LoadSavedMap {
  static readonly type = '[Base Map] Load saved map'
}

export class ToggleBuildindsLayer {
  static readonly type = '[Base Map] Toggle buildings layer'
}

export class LoadAnimation {
  static readonly type = '[Base Map] Load animation'
}
