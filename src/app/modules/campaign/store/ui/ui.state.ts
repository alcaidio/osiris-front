import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { CloseMapCard, CloseViewer, OpenMapCard, OpenViewer, ToggleMapCard } from './ui.actions'

interface UI {
  viewer: boolean
  mapCard: boolean
}

const defaultUIState = {
  viewer: false,
  mapCard: true,
}

@State<UI>({
  name: 'ui',
  defaults: defaultUIState,
})
@Injectable()
export class UIState {
  @Selector()
  static getViewer(state: UI) {
    return state.viewer
  }

  @Selector()
  static getMapCard(state: UI) {
    return state.mapCard
  }

  constructor() {}

  @Action(OpenMapCard)
  openMapCard(ctx: StateContext<UI>) {
    ctx.patchState({ mapCard: true })
  }

  @Action(CloseMapCard)
  closeMapCard(ctx: StateContext<UI>) {
    ctx.patchState({ mapCard: false })
  }

  @Action(ToggleMapCard)
  toggleMapCard(ctx: StateContext<UI>) {
    const state = ctx.getState()
    ctx.patchState({ mapCard: !state.mapCard })
  }

  @Action(OpenViewer)
  openViewer(ctx: StateContext<UI>) {
    const state = ctx.getState()
    if (state.mapCard && state.viewer) {
      ctx.patchState({ viewer: true })
    } else {
      ctx.patchState({ viewer: true, mapCard: false })
    }
  }

  @Action(CloseViewer)
  closeViewer(ctx: StateContext<UI>) {
    ctx.patchState({ viewer: false })
  }
}
