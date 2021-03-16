export class OpenMapCard {
  static readonly type = '[ui] open map card'
}

export class CloseMapCard {
  static readonly type = '[ui] close map card'
}

export class ToggleMapCard {
  static readonly type = '[ui] toggle map card'
}

export class OpenViewer {
  static readonly type = '[ui] open viewer'
}

export class CloseViewer {
  static readonly type = '[ui] close viewer'
}

export class OpenData {
  static readonly type = '[ui] open data'
}

export class CloseData {
  static readonly type = '[ui] close data'
}

export class ToggleData {
  static readonly type = '[ui] toggle data'
}

export class ToggleViewerFullscreen {
  static readonly type = '[ui] toggle viewer fullscreen'
  constructor(public payload?: boolean) {}
}

export class ToggleIsHoverTrace {
  static readonly type = '[ui] toggle is hover trace'
}
