import { Overlay } from '../../model/shared.model'

export class GetOverlays {
  static readonly type = '[overlays] get by map id'
  constructor(public mapId: string) {}
}

export class ToggleOverlay {
  static readonly type = '[overlays] toggle one'
  constructor(public payload: { id: string; visible: boolean }) {}
}

export class FilterOverlay {
  static readonly type = '[overlays] filter one'
  constructor(public overlay: Overlay) {}
}
