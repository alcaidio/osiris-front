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
import { convertConfigToLeaflet } from '../../utils'
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
    return convertConfigToLeaflet(state.entities[state.active].config) as Config
  }

  @Action(GetMap)
  getMaps(ctx: StateContext<MapState>, action: GetMap) {
    ctx.dispatch(new SetLoading(MapState, true))

    return this.api.getMapSmall(action.mapId).pipe(
      map((mapSmall: MapSmall) => {
        const mapIds = ctx.getState()['ids']
        const isMapInStore = mapIds.find((id) => mapSmall.id === id)

        if (!isMapInStore) {
          ctx.dispatch(new Add(MapState, mapSmall))
        }

        ctx.dispatch(new SetActive(MapState, mapSmall.id as string))
        ctx.dispatch(new SetActive(BaselayerState, mapSmall.config.layers.id as string))

        // REMOVE: Simulation latence
        setTimeout(() => {
          ctx.dispatch(new SetLoading(MapState, false))
        }, 200)
      }),
      catchError((err) => {
        ctx.dispatch(new SetError(MapState, err))
        ctx.dispatch(new SetLoading(MapState, false))
        return of(err)
      })
    )
  }
}
