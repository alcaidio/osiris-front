import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { config } from 'process'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BaseMap } from '../../../../shared/models/maps.model'
import { DiagService } from '../../services/diag.service'
import { ChangeBaseLayer, LoadBaseMap, LoadBaseMapFailure, LoadBaseMapSuccess, SetMapConfig } from './base-map.action'

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
  name: 'diagnosisBaseMap',
  defaults: baseMapStateDefaults,
})
@Injectable()
export class BaseMapState {
  constructor(private diagService: DiagService, private notification: NotificationService) {}

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

  // TODO : toggle layers

  @Action(ChangeBaseLayer)
  changeBaseLayer({ getState, patchState }: StateContext<BaseMapStateModel>, action: ChangeBaseLayer) {
    const state = getState()
    if (state.model.config.style === action.payload) {
      this.notification.openSnackBar('Ce fond de carte est déjà chargé.', 'X')
    } else {
      patchState({
        model: {
          ...state.model,
          config: {
            ...config,
            style: action.payload,
          },
        },
      })
    }
  }
}
