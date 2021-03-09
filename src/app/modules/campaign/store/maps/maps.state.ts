import { Injectable } from '@angular/core'
import {
  CreateOrReplace,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  SetActive,
  SetError,
  SetLoading,
} from '@ngxs-labs/entity-state'
import { Navigate } from '@ngxs/router-plugin'
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
  getMap(ctx: StateContext<EntityStateModel<MapSmall>>, action: GetMap) {
    ctx.dispatch(new SetLoading(MapState, true))
    return this.api.getMap(action.mapId).pipe(
      map((mapSmall: MapSmall) => {
        ctx.dispatch(new CreateOrReplace(MapState, mapSmall))
        ctx.dispatch(new SetActive(MapState, mapSmall.id as string))
        ctx.dispatch(new SetActive(BaselayerState, mapSmall.config.layers.id as string))
        ctx.dispatch(new SetLoading(MapState, false))
      }),
      catchError((err) => {
        ctx.dispatch(new SetError(MapState, err))
        ctx.dispatch(new SetLoading(MapState, false))
        ctx.dispatch(new Navigate(['/']))
        return of(err)
      })
    )
  }
}
