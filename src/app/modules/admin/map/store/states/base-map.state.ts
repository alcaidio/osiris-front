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
  MapIsLoaded,
  SaveActiveMap,
  ToggleBuildindsLayer
} from '../actions/base-map.action'
import { NotificationService } from './../../../../../shared/services/notification.service'
import { BaseMap } from './../../models/base-map.model'
import { DiagService } from './../../services/diag.service'
import { GetActiveMap } from './../actions/base-map.action'

export interface BaseMapStateModel {
  isRender: boolean
  default: BaseMap | null
  active: BaseMap | null
  saved: BaseMap | null
  buildings: boolean
  loading: boolean
  loaded: boolean
  error: any | null
}

@State<BaseMapStateModel>({
  name: 'baseMap',
  defaults: {
    isRender: false,
    default: null,
    active: null,
    saved: null,
    buildings: false,
    loading: false,
    loaded: false,
    error: null,
  },
})
@Injectable()
export class BaseMapState {
  constructor(private diagService: DiagService, private notification: NotificationService) {}

  @Selector()
  static getSavedMapOrDefault(state: BaseMapStateModel) {
    if (state.saved === null) {
      return state.default
    } else {
      return state.saved
    }
  }

  @Selector()
  static getActiveMap(state: BaseMapStateModel) {
    return state.active
  }

  @Selector()
  static getMapIsRender(state: BaseMapStateModel) {
    return state.isRender
  }

  @Selector()
  static getLoaded(state: BaseMapStateModel) {
    return state.loaded
  }

  @Selector()
  static getLoading(state: BaseMapStateModel) {
    return state.loading
  }

  @Selector()
  static isBuildings(state: BaseMapStateModel) {
    return state.buildings
  }

  @Action(MapIsLoaded)
  mapIsloaded({ patchState }: StateContext<BaseMapStateModel>) {
    patchState({
      isRender: true,
    })
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
  loadSuccess({ patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapSuccess) {
    const baseMap = {
      style: action.payload.style,
      pitch: action.payload.pitch,
      bounds: action.payload.bounds,
      maxBounds: action.payload.maxBounds,
      minZoom: action.payload.minZoom,
    }
    patchState({
      default: baseMap,
      active: baseMap,
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
    if (state.active.style === action.payload) {
      this.notification.openSnackBar('Ce fond de carte est déjà chargé.', 'X')
    } else {
      patchState({
        active: {
          ...state.active,
          style: action.payload,
        },
      })
    }
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
      saved: { ...state.default, ...state.active },
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
