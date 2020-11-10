import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { ToggleForeground, ToggleMinimize } from './ui.action'

export interface UiStateModel {
  imageInbig: boolean
  minimize: boolean
}

export const uiStateDefaults: UiStateModel = {
  imageInbig: false,
  minimize: true,
}

@State<UiStateModel>({
  name: 'imajboxUi',
  defaults: uiStateDefaults,
})
@Injectable()
export class UiState {
  @Selector()
  static getImageInBig(state: UiStateModel) {
    return state.imageInbig
  }

  @Selector()
  static getMinimize(state: UiStateModel) {
    return state.minimize
  }

  @Action(ToggleForeground)
  toggleForeground({ patchState, getState }: StateContext<UiStateModel>) {
    const state = getState()
    patchState({
      imageInbig: !state.imageInbig,
    })
  }

  @Action(ToggleMinimize)
  toggleMinimieze({ patchState, getState }: StateContext<UiStateModel>) {
    const state = getState()
    patchState({
      minimize: !state.minimize,
    })
  }
}
