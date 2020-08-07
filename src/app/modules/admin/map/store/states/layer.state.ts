import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Layer } from '../../models/layer.model'
import { LoadLayers, LoadLayersFailure, LoadLayersSuccess, ToggleLayer } from '../actions/layer.action'
import { ID } from './../../../../../shared/shared.model'
import { DiagService } from './../../services/diag.service'

export interface LayersStateModel {
  ids: ID[]
  entities: {
    [id: string]: Layer
  }
  loading: boolean
  error: string | null
}

@State<LayersStateModel>({
  name: 'layers',
  defaults: {
    ids: [],
    entities: {},
    loading: false,
    error: null,
  },
})
@Injectable()
export class LayersState {
  constructor(private diagService: DiagService) {}

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
    const res = []
    Object.values(state.entities).map((l) => {
      res.push({ id: l.id, name: l.name, visible: l.visible })
    })
    return res
  }

  @Action(LoadLayers)
  load({ dispatch, patchState }: StateContext<LayersStateModel>) {
    patchState({
      loading: true,
    })
    return this.diagService.getLayers().pipe(
      map((ls: Layer[]) => dispatch(new LoadLayersSuccess(ls))),
      catchError((err) => {
        dispatch(new LoadLayersFailure(err.error.error.message))
        return of(new LoadLayersFailure(err))
      })
    )
  }

  @Action(LoadLayersSuccess)
  loadSuccess({ getState, patchState }: StateContext<LayersStateModel>, action: LoadLayersSuccess) {
    action.payload.map((l: Layer) => {
      const state = getState()
      const layer = { ...l, visible: true }
      patchState({
        ids: [...state.ids, layer.id],
        entities: { ...state.entities, [layer.id]: layer },
        loading: false,
      })
    })
  }

  @Action(LoadLayersFailure)
  loadFailure({ patchState }: StateContext<LayersStateModel>, action: LoadLayersFailure) {
    patchState({
      error: action.payload,
      loading: false,
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
