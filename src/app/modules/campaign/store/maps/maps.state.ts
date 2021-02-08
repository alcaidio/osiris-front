import { Injectable } from '@angular/core'
import {
  Add,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  SetActive,
  SetError,
  SetLoading,
} from '@ngxs-labs/entity-state'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ApiService } from '../../services/api.service'
import { BaselayerState } from '../baselayers/baselayers.state'
import { Config, MapSmall } from './../../model/shared.model'
import { GetMap } from './maps.actions'

@State<EntityStateModel<MapSmall>>({
  name: 'maps',
  defaults: defaultEntityState(),
})
@Injectable()
export class MapState extends EntityState<MapSmall> {
  constructor(private api: ApiService) {
    super(MapState, 'id', IdStrategy.EntityIdGenerator)
  }

  @Selector()
  static getMapConfig(state: EntityStateModel<MapSmall>) {
    return state.entities[state.active].config as Config
  }

  @Action(GetMap)
  getMaps(ctx: StateContext<EntityStateModel<MapSmall>>, action: GetMap) {
    ctx.dispatch(new SetLoading(MapState, true))
    const mapIds = ctx.getState().ids
    const isMapInStore = mapIds.length > 0 && mapIds.includes(action.mapId)
    if (!isMapInStore) {
      return this.api.getMapSmall(action.mapId).pipe(
        map((mapSmall: MapSmall) => {
          ctx.dispatch(new Add(MapState, mapSmall))
          ctx.dispatch(new SetActive(MapState, mapSmall.id as string))
          ctx.dispatch(new SetActive(BaselayerState, mapSmall.config.layers.id as string))
          ctx.dispatch(new SetLoading(MapState, false))
        }),
        catchError((err) => {
          ctx.dispatch(new SetError(MapState, err))
          ctx.dispatch(new SetLoading(MapState, false))
          return of(err)
        })
      )
    }
  }
}
