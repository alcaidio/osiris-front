import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import {
  CloseButtonStyle,
  CloseDrawer,
  OpenButtonStyle,
  OpenDrawer,
  ToggleButtonStyle,
  ToggleDrawer,
} from '../actions/ui.action'

export interface UIStateModel {
  buttonStyle: boolean
  drawer: {
    mode: 'over' | 'push' | 'side'
    position: 'start' | 'end'
    opened: boolean
  }
}

export const UIStateDefaults: UIStateModel = {
  buttonStyle: false,
  drawer: {
    mode: 'side',
    position: 'end',
    opened: false,
  },
}

@State<UIStateModel>({
  name: 'ui',
  defaults: UIStateDefaults,
})
@Injectable()
export class UIState {
  constructor() {}

  @Selector()
  static getDrawer(state: UIStateModel) {
    return state.drawer
  }

  @Selector()
  static getDrawerOpened(state: UIStateModel) {
    return state.drawer.opened
  }

  @Selector()
  static getButtonStyle(state: UIStateModel) {
    return state.buttonStyle
  }

  @Action(ToggleDrawer)
  toggleDrawer({ patchState, getState }: StateContext<UIStateModel>) {
    const state = getState()
    patchState({
      drawer: {
        ...state.drawer,
        opened: !state.drawer.opened,
      },
    })
  }

  @Action(OpenDrawer)
  openDrawer({ patchState, getState }: StateContext<UIStateModel>) {
    const state = getState()

    patchState({
      drawer: {
        ...state.drawer,
        opened: true,
      },
    })
  }

  @Action(CloseDrawer)
  closeDrawer({ patchState, getState }: StateContext<UIStateModel>) {
    const state = getState()
    patchState({
      drawer: {
        ...state.drawer,
        opened: false,
      },
    })
  }

  @Action(ToggleButtonStyle)
  toggleButtonStyle({ patchState, getState }: StateContext<UIStateModel>) {
    const state = getState()
    patchState({
      buttonStyle: !state.buttonStyle,
    })
  }

  @Action(OpenButtonStyle)
  openButtonStyle({ patchState }: StateContext<UIStateModel>) {
    patchState({
      buttonStyle: true,
    })
  }

  @Action(CloseButtonStyle)
  closeButtonStyle({ patchState }: StateContext<UIStateModel>) {
    patchState({
      buttonStyle: false,
    })
  }
}
