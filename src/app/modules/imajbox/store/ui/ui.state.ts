import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { SetForeground, SetMinimize, ToggleForeground, ToggleMinimize } from './ui.action'

export interface UiStateModel {
  imageInbig: boolean
  minimize: boolean
}

export const uiStateDefaults: UiStateModel = {
  imageInbig: false,
  minimize: false,
}

@State<UiStateModel>({
  name: 'imajboxUi',
  defaults: uiStateDefaults,
})
@Injectable()
export class UiState {
  constructor(private store: Store) {}

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
    this.store.dispatch(new Navigate(['/'], { image: !state.imageInbig }, { queryParamsHandling: 'merge' }))
  }

  @Action(ToggleMinimize)
  toggleMinimize({ patchState, getState }: StateContext<UiStateModel>) {
    const state = getState()
    patchState({
      minimize: !state.minimize,
    })
    this.store.dispatch(new Navigate(['/'], { minimize: !state.minimize }, { queryParamsHandling: 'merge' }))
  }

  @Action(SetForeground)
  setForeground({ patchState }: StateContext<UiStateModel>, action: SetForeground) {
    patchState({
      imageInbig: action.payload,
    })
    this.store.dispatch(new Navigate(['/'], { image: action.payload }, { queryParamsHandling: 'merge' }))
  }

  @Action(SetMinimize)
  setMinimize({ patchState }: StateContext<UiStateModel>, action: SetMinimize) {
    patchState({
      minimize: action.payload,
    })
    this.store.dispatch(new Navigate(['/'], { minimize: action.payload }, { queryParamsHandling: 'merge' }))
  }
}
