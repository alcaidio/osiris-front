import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import {
  ChangeMapStyle,
  LoadBaseMap,
  LoadBaseMapFailure,
  LoadBaseMapSuccess,
  LoadSavedMap,
  SaveActiveMap,
  ToggleBuildindsLayer,
} from '../actions/base-map.action'
import { BaseMap } from './../../models/base-map.model'
import { DiagService } from './../../services/diag.service'
import { GetActiveMap } from './../actions/base-map.action'

export interface BaseMapStateModel {
  active: BaseMap
  saved: BaseMap
  buildings: boolean
  loading: boolean
  loaded: boolean
  error: any | null
}

export const defaultMap: BaseMap = {
  style: '',
  center: [0, 0],
  zoom: 0,
  pitch: 0,
  bearing: 0,
}

@State<BaseMapStateModel>({
  name: 'baseMap',
  defaults: {
    active: defaultMap,
    saved: defaultMap,
    buildings: false,
    loading: false,
    loaded: false,
    error: null,
  },
})
@Injectable()
export class BaseMapState {
  constructor(private diagService: DiagService) {}

  @Selector()
  static getActiveMap(state: BaseMapStateModel) {
    return state.active
  }

  @Selector()
  static getSavedMap(state: BaseMapStateModel) {
    return state.saved
  }

  @Selector()
  static getLoaded(state: BaseMapStateModel) {
    return state.loaded
  }

  @Selector()
  static isBuildings(state: BaseMapStateModel) {
    return state.buildings
  }

  @Action(LoadBaseMap)
  load({ getState, dispatch, patchState }: StateContext<BaseMapStateModel>) {
    if (!getState().loaded) {
      patchState({
        loading: true,
      })
      return this.diagService.getBaseMap().pipe(
        map((baseMap: BaseMap) => dispatch(new LoadBaseMapSuccess(baseMap))),
        catchError((err) => {
          dispatch(new LoadBaseMapFailure(err))
          return of(err)
        })
      )
    }
  }

  @Action(LoadBaseMapSuccess)
  loadSuccess({ getState, patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapSuccess) {
    const baseMap = action.payload
    const state = getState()
    patchState({
      active: {
        ...state.active,
        style: baseMap.style,
        center: baseMap.center,
        zoom: baseMap.zoom,
        pitch: baseMap.pitch,
        maxBounds: baseMap.maxBounds,
      },
      loading: false,
      loaded: true,
    })
  }

  @Action(LoadBaseMapFailure)
  loadFailure({ patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapFailure) {
    patchState({
      error: action.payload,
      loading: false,
      loaded: false,
    })
  }

  @Action(ChangeMapStyle)
  changeMapStyle({ getState, patchState }: StateContext<BaseMapStateModel>, action: ChangeMapStyle) {
    const state = getState()
    patchState({
      active: {
        ...state.active,
        style: action.payload,
      },
    })
  }

  @Action(GetActiveMap)
  getActiveMap({ getState, patchState }: StateContext<BaseMapStateModel>, action: GetActiveMap) {
    const state = getState()
    const activeMap = { ...state.active, ...action.payload }
    patchState({
      active: activeMap,
    })
  }

  @Action(SaveActiveMap)
  saveActiveMap({ getState, patchState }: StateContext<BaseMapStateModel>) {
    const state = getState()
    patchState({
      saved: state.active,
    })
  }

  @Action(LoadSavedMap)
  loadSavedMap({ getState, patchState }: StateContext<BaseMapStateModel>) {
    const state = getState()
    patchState({
      active: state.saved,
    })
  }

  @Action(ToggleBuildindsLayer)
  toggleBuildindsLayer({ getState, patchState }: StateContext<BaseMapStateModel>) {
    const state = getState()
    const minZoom = (zoom: number) => {
      return zoom < 16.2 ? 16.2 : zoom
    }
    if (state.buildings) {
      patchState({
        buildings: false,
        active: {
          ...state.active,
          // pitch to 0 don't work
          pitch: Math.pow(10, -10),
        },
      })
    } else {
      patchState({
        buildings: true,
        active: {
          ...state.active,
          zoom: minZoom(state.active.zoom),
          pitch: 60,
        },
      })
    }
  }
}
