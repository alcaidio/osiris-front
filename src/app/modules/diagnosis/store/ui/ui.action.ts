import { DrawerMode } from './../../../../shared/models/ui.model'

export class ToggleDrawer {
  static readonly type = '[Diagnosis - UI] Toggle drawer'
}

export class OpenDrawer {
  static readonly type = '[Diagnosis - UI] Open drawer'
}

export class CloseDrawer {
  static readonly type = '[Diagnosis - UI] Close drawer'
}

export class ChangeDrawerMode {
  static readonly type = '[Diagnosis - UI] Change drawer mode'
  constructor(public payload: DrawerMode) {}
}
