import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ChangeMapStyle, LoadBaseMap, LoadBaseMapFailure, LoadBaseMapSuccess } from '../actions/base-map.action'
import { BaseMap } from './../../models/base-map.model'
import { DiagService } from './../../services/diag.service'
import { CloneActiveMapInPreviousMap } from './../actions/base-map.action'

export interface BaseMapStateModel {
  active: BaseMap
  previous: BaseMap
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
    previous: defaultMap,
    loading: false,
    loaded: false,
    error: null,
  },
})
@Injectable()
export class BaseMapState {
  constructor(private diagService: DiagService, private store: Store) {}

  @Selector()
  static getActiveMap(state: BaseMapStateModel) {
    if (state.previous !== defaultMap) {
      return state.previous
    } else {
      return state.active
    }
  }

  @Selector()
  static getPreviousMap(state: BaseMapStateModel) {
    return state.previous
  }

  @Selector()
  static getLoaded(state: BaseMapStateModel) {
    return state.loaded
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

  @Action(CloneActiveMapInPreviousMap)
  cloneActiveMapInPrivious(
    { getState, patchState }: StateContext<BaseMapStateModel>,
    action: CloneActiveMapInPreviousMap
  ) {
    const state = getState()
    const activeMap = action.payload
    const previousMap = { ...state.active, ...activeMap }
    patchState({
      previous: previousMap,
    })
  }
}
