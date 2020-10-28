import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { ID } from 'app/shared/shared.model'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Filter, Layer } from '../../models/layer.model'
import { DiagService } from '../../services/diag.service'
import { LoadLayers, LoadLayersFailure, LoadLayersSuccess, ToggleLayer } from '../actions/layer.action'

export interface LayersStateModel {
  ids: ID[]
  entities: {
    [id: string]: Layer
  }
  filters: Filter[]
  loading: boolean
  loaded: boolean
  error: string | null
}

export const layersStateDefaults: LayersStateModel = {
  ids: [],
  entities: {},
  filters: [],
  loading: false,
  loaded: false,
  error: null,
}

@State<LayersStateModel>({
  name: 'layers',
  defaults: layersStateDefaults,
})
@Injectable()
export class LayersState {
  constructor(private diagService: DiagService) {}

  @Selector()
  static getLoading(state: LayersStateModel) {
    return state.loading
  }

  @Selector()
  static getLoaded(state: LayersStateModel) {
    return state.loaded
  }

  @Selector()
  static getEntities(state: LayersStateModel) {
    return state.entities
  }

  @Selector()
  static getLayers(state: LayersStateModel) {
    return Object.values(state.entities)
  }

  @Selector()
  static getFilter(state: LayersStateModel) {
    return state.filters
  }

  @Action(LoadLayers)
  load({ getState, dispatch, patchState }: StateContext<LayersStateModel>) {
    if (!getState().loaded) {
      patchState({
        loading: true,
      })
      return this.diagService.getLayers().pipe(
        map((ls: Layer[]) => dispatch(new LoadLayersSuccess(ls))),
        catchError((err) => {
          dispatch(new LoadLayersFailure(err))
          return of(err)
        })
      )
    }
  }

  @Action(LoadLayersSuccess)
  loadSuccess({ getState, patchState }: StateContext<LayersStateModel>, action: LoadLayersSuccess) {
    action.payload.map((layer: Layer) => {
      const state = getState()
      const filter = { id: layer.id, name: layer.name, visible: layer.visible, color: layer.paint['line-color'] }
      patchState({
        ids: [...state.ids.filter((e) => e !== layer.id), layer.id],
        entities: { ...state.entities, [layer.id]: layer },
        filters: [...state.filters, filter],
        loading: false,
        loaded: true,
      })
    })
  }

  @Action(LoadLayersFailure)
  loadFailure({ patchState }: StateContext<LayersStateModel>, action: LoadLayersFailure) {
    patchState({
      error: action.payload,
      loading: false,
      loaded: false,
    })
  }

  @Action(ToggleLayer)
  toggle({ getState, patchState }: StateContext<LayersStateModel>, action: ToggleLayer) {
    const state = getState()
    const layer = state.entities[action.payload]
    const layerToggled = { ...layer, visible: !layer.visible }
    patchState({
      entities: { ...state.entities, [layerToggled.id]: layerToggled },
    })
  }
}
