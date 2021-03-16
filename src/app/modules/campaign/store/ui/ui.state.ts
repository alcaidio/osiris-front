import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import {
  CloseData,
  CloseMapCard,
  CloseViewer,
  OpenData,
  OpenMapCard,
  OpenViewer,
  ToggleData,
  ToggleIsHoverTrace,
  ToggleMapCard,
  ToggleViewerFullscreen,
} from './ui.actions'

interface UI {
  viewer: boolean
  mapCard: boolean
  data: boolean
  viewerFullscreen: boolean
  isHoverTrace: boolean
}

const defaultUIState = {
  viewer: false,
  mapCard: true,
  data: false,
  viewerFullscreen: false,
  isHoverTrace: false,
}

@State<UI>({
  name: 'ui',
  defaults: defaultUIState,
})
@Injectable()
export class UIState {
  @Selector()
  static getIsViewer(state: UI) {
    return state.viewer
  }

  @Selector()
  static getIsMapCard(state: UI) {
    return state.mapCard
  }

  @Selector()
  static getIsData(state: UI) {
    return state.data
  }

  @Selector()
  static getIsViewerFullscreen(state: UI) {
    return state.viewerFullscreen
  }

  @Selector()
  static getIsHoverTrace(state: UI) {
    return state.isHoverTrace
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
    if (state.data) {
      ctx.patchState({ mapCard: !state.mapCard, data: false })
    } else {
      ctx.patchState({ mapCard: !state.mapCard })
    }
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

  @Action(OpenData)
  opendata(ctx: StateContext<UI>) {
    const state = ctx.getState()
    if (state.mapCard && state.data) {
      ctx.patchState({ data: true })
    } else {
      ctx.patchState({ data: true, mapCard: false })
    }
  }

  @Action(CloseData)
  closedata(ctx: StateContext<UI>) {
    const state = ctx.getState()
    if (!state.mapCard) {
      ctx.patchState({ data: false, mapCard: true })
    } else {
      ctx.patchState({ data: false })
    }
  }

  @Action(ToggleData)
  toggleData(ctx: StateContext<UI>) {
    const state = ctx.getState()
    if (state.mapCard) {
      ctx.patchState({ data: !state.data, mapCard: false })
    } else {
      ctx.patchState({ data: !state.data })
    }
  }

  @Action(ToggleViewerFullscreen)
  toggleViewerFullscreen(ctx: StateContext<UI>, action: ToggleViewerFullscreen) {
    const state = ctx.getState()
    const fullscreen = action.payload
    if (fullscreen) {
      if (state.mapCard) {
        ctx.patchState({ viewerFullscreen: fullscreen, mapCard: false })
      } else {
        ctx.patchState({ viewerFullscreen: fullscreen })
      }
    } else {
      if (state.mapCard) {
        ctx.patchState({ viewerFullscreen: !state.viewerFullscreen, mapCard: false })
      } else {
        ctx.patchState({ viewerFullscreen: !state.viewerFullscreen })
      }
    }
  }

  @Action(ToggleIsHoverTrace)
  toggleIsHoverTrace(ctx: StateContext<UI>) {
    const state = ctx.getState()
    ctx.patchState({ isHoverTrace: !state.isHoverTrace })
  }
}
