import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import {
  CloseDrawer,
  OpenDrawer,
  ToggleDrawer
} from '../actions/ui.action'

export interface UIStateModel {
  drawer: {
    mode: 'over' | 'push' | 'side'
    position: 'start' | 'end'
    opened: boolean
  }
}

export const UIStateDefaults: UIStateModel = {
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


}
