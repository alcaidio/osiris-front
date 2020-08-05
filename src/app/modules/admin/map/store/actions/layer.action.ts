import { Layer } from '../../models/layer.model'

export class LoadLayers {
  static readonly type = '[Layer] Load'
}

export class LoadLayersSuccess {
  static readonly type = '[Layer] Load Success'
  constructor(public payload: Layer[]) {}
}

export class LoadLayersFailure {
  static readonly type = '[Layer] Load Failure'
  constructor(public payload: any) {}
}

export class ToggleLayer {
  static readonly type = '[Layer] Toggle layer'
  constructor(public payload: number) {}
}
