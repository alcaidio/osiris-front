import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { Drawer } from 'app/shared/models'
import { ChangeDrawerMode, CloseDrawer, OpenDrawer, ToggleDrawer } from './ui.action'

export interface UIStateModel {
  drawer: Drawer
}

export const UIStateDefaults: UIStateModel = {
  drawer: {
    mode: 'side',
    position: 'end',
    opened: false,
  },
}

@State<UIStateModel>({
  name: 'diagnosisUi',
  defaults: UIStateDefaults,
})
@Injectable()
export class UIState {
  @Selector()
  static getDrawer(state: UIStateModel): Drawer {
    return state.drawer
  }

  @Selector()
  static getDrawerOpened(state: UIStateModel): boolean {
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

  @Action(ChangeDrawerMode)
  changeDrawerMode({ patchState, getState }: StateContext<UIStateModel>, action: ChangeDrawerMode) {
    const state = getState()
    patchState({
      drawer: {
        ...state.drawer,
        mode: action.payload,
      },
    })
  }
}
