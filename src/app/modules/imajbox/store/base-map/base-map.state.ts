import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { PictureService } from '../../services/picture.service'
import { BaseMap } from './../../../../shared/models/maps.model'
import { LoadBaseMap, LoadBaseMapFailure, LoadBaseMapSuccess, SetMapConfig } from './base-map.action'

export interface BaseMapStateModel {
  model: BaseMap | null
  // id: number
  // config: MapConfig
  // baselayers: Baselayer[]
  // overlays: Overlay[]
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
  name: 'baseMap',
  defaults: baseMapStateDefaults,
})
@Injectable()
export class BaseMapState {
  constructor(private pictureService: PictureService) {}

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

  @Action(LoadBaseMapSuccess)
  loadSuccess({ patchState }: StateContext<BaseMapStateModel>, action: LoadBaseMapSuccess) {
    patchState({
      model: action.payload,
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

  @Action(SetMapConfig)
  saveMap({ getState, patchState }: StateContext<BaseMapStateModel>, action: SetMapConfig) {
    const state = getState()
    patchState({
      model: {
        ...state.model,
        config: { ...state.model.config, ...action.payload },
      },
    })
  }
}
