import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ChangeMapStyle, LoadBaseMap, LoadBaseMapFailure, LoadBaseMapSuccess } from '../actions/base-map.action'
import { BaseMap } from './../../models/base-map.model'
import { DiagService } from './../../services/diag.service'
import { SaveBaseMapConfig } from './../actions/base-map.action'

export interface BaseMapStateModel {
  map: BaseMap
  loading: boolean
  loaded: boolean
  error: any | null
}

@State<BaseMapStateModel>({
  name: 'baseMap',
  defaults: {
    map: {
      style: '',
      center: [0, 0],
      zoom: 0,
      pitch: 0,
      bearing: 0,
    },
    loading: false,
    loaded: false,
    error: null,
  },
})
@Injectable()
export class BaseMapState {
  constructor(private diagService: DiagService, private store: Store) {}

  @Selector()
  static getBaseMap(state: BaseMapStateModel) {
    return state.map
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
      map: {
        ...state.map,
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
      map: {
        ...state.map,
        style: action.payload,
      },
    })
  }

  @Action(SaveBaseMapConfig)
  saveBaseMapConfig({ getState, patchState }: StateContext<BaseMapStateModel>, action: SaveBaseMapConfig) {
    const state = getState()
    const e = action.payload
    const newMap = { ...state.map, ...e }
    patchState({
      map: newMap,
    })
  }
}
