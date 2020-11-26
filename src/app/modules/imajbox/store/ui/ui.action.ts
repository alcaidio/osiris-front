export class ToggleForeground {
  static readonly type = '[Imajbox - UI] Toggle Foreground and background'
}

export class ToggleMinimize {
  static readonly type = '[Imajbox - UI] Toggle minimize'
}

export class SetForeground {
  static readonly type = '[Imajbox - UI] Set Foreground and background'
  constructor(public payload: boolean) {}
}

export class SetMinimize {
  static readonly type = '[Imajbox - UI] Set minimize'
  constructor(public payload: boolean) {}
}
