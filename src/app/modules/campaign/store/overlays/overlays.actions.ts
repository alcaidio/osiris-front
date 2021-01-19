export class GetOverlays {
  static readonly type = '[overlays] get'
  constructor(public overlayIds: string[]) {}
}

export class ToggleOverlay {
  static readonly type = '[overlays] toggle one'
  constructor(public payload: { id: string; visible: boolean }) {}
}
