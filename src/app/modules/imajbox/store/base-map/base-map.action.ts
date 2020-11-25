import { BaseMap, MapConfig } from './../../../../shared/models/maps.model'

export class LoadBaseMap {
  static readonly type = '[Imajbox - Base Map] Load'
}

export class LoadBaseMapWithParams {
  static readonly type = '[Imajbox - Base Map] Load with params bounds'
  constructor(public payload: number[]) {}
}

export class LoadBaseMapSuccess {
  static readonly type = '[Imajbox - Base Map] Load Success'
  constructor(public payload: BaseMap) {}
}

export class LoadBaseMapFailure {
  static readonly type = '[Imajbox - Base Map] Load Failure'
  constructor(public payload: any) {}
}

export class SetMapConfig {
  static readonly type = '[Imajbox - Base Map] Set map config'
  constructor(public payload: Partial<MapConfig>) {}
}
