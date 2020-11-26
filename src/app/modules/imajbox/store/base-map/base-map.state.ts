import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { PictureService } from '../../services/picture.service'
import { BaseMap } from './../../../../shared/models/maps.model'
import {
  LoadBaseMap,
  LoadBaseMapFailure,
  LoadBaseMapSuccess,
  LoadBaseMapWithParams,
  SetMapConfig,
} from './base-map.action'

export const convertBounds = (bound: any): number[] => {
  return [bound._sw.lng, bound._sw.lat, bound._ne.lng, bound._ne.lat]
}

export const convertBoundsFromUrlAndVerify = (bounds: string): number[] => {
  if (bounds) {
    const b = bounds.split(',')
    if (+b[0] && +b[1] && +b[2] && +b[3]) {
      return [+b[0], +b[1], +b[2], +b[3]]
    }
  }
}

export interface BaseMapStateModel {
  model: BaseMap | null
  loading: boolean
  loaded: boolean
  error: string | null
}

export const baseMapStateDefaults: BaseMapStateModel = {
  model: null,
  loading: false,
  loaded: false,
  error: null,
}

@State<BaseMapStateModel>({
  name: 'imajboxBaseMap',
  defaults: baseMapStateDefaults,
})
@Injectable()
export class BaseMapState {
  constructor(private pictureService: PictureService, private store: Store, private route: ActivatedRoute) {}

  @Selector()
  static getMap(state: BaseMapStateModel): any {
    return state.model
  }

  @Selector()
  static getLoading(state: BaseMapStateModel): boolean {
    return state.loading
  }

  @Action(LoadBaseMap)
  load({ getState, dispatch, patchState }: StateContext<BaseMapStateModel>) {
    if (!getState().loaded) {
      patchState({
        loading: true,
      })
      return this.pictureService.getBaseMap().pipe(
        map((baseMap: BaseMap) => dispatch(new LoadBaseMapSuccess(baseMap))),
        catchError((err) => {
          dispatch(new LoadBaseMapFailure(err))
          return of(err)
        })
      )
    }
  }

  @Action(LoadBaseMapWithParams)
  loadWithParams({ getState, dispatch, patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapWithParams) {
    if (!getState().loaded) {
      patchState({
        loading: true,
      })
      return this.pictureService.getBaseMap().pipe(
        map((baseMap: BaseMap) => {
          const baseMapWithParams = {
            ...baseMap,
            config: { ...baseMap.config, bounds: convertBoundsFromUrlAndVerify(action.payload) },
          }
          dispatch(new LoadBaseMapSuccess(baseMapWithParams as any))
        }),
        catchError((err) => {
          dispatch(new LoadBaseMapFailure(err))
          return of(err)
        })
      )
    }
  }

  @Action(LoadBaseMapSuccess)
  loadSuccess({ patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapSuccess) {
    patchState({
      model: action.payload,
      loading: false,
      loaded: true,
    })

    const bounds = action.payload.config.bounds
    const bbox = `${bounds[0].toFixed(5)},${bounds[1].toFixed(5)},${bounds[2].toFixed(5)},${bounds[3].toFixed(5)}`
    this.store.dispatch(new Navigate([], { bbox }, { queryParamsHandling: 'merge', relativeTo: this.route }))
  }

  @Action(LoadBaseMapFailure)
  loadFailure({ patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapFailure) {
    patchState({
      error: action.payload,
      loading: false,
      loaded: false,
    })
  }

  @Action(SetMapConfig)
  saveMap({ getState, patchState }: StateContext<BaseMapStateModel>, action: SetMapConfig) {
    const state = getState()
    const newConfig = { ...state.model.config, ...action.payload }
    patchState({
      model: {
        ...state.model,
        config: newConfig,
      },
    })
    const bounds = newConfig.bounds
    const bbox = `${bounds[0].toFixed(5)},${bounds[1].toFixed(5)},${bounds[2].toFixed(5)},${bounds[3].toFixed(5)}`
    this.store.dispatch(new Navigate([], { bbox }, { queryParamsHandling: 'merge', relativeTo: this.route }))
  }
}
