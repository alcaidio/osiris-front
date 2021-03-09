import { Injectable } from '@angular/core'
import {
  CreateOrReplace,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  SetError,
  SetLoading,
} from '@ngxs-labs/entity-state'
import { Action, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ApiService } from '../../services/api.service'
import { BaseLayer } from './../../model/shared.model'
import { GetBaselayers } from './baselayers.actions'

@State<EntityStateModel<BaseLayer>>({
  name: 'baselayers',
  defaults: defaultEntityState(),
})
@Injectable()
export class BaselayerState extends EntityState<BaseLayer> {
  constructor(private api: ApiService) {
    super(BaselayerState, 'id', IdStrategy.EntityIdGenerator)
  }

  @Action(GetBaselayers)
  getBaselayers(ctx: StateContext<BaselayerState>, action: GetBaselayers) {
    ctx.dispatch(new SetLoading(BaselayerState, true))

    return this.api.getBaselayersByMapId(action.mapId).pipe(
      map((baselayers: BaseLayer[]) => {
        ctx.dispatch(new CreateOrReplace(BaselayerState, baselayers))
        ctx.dispatch(new SetLoading(BaselayerState, false))
      }),
      catchError((err) => {
        ctx.dispatch(new SetError(BaselayerState, err))
        ctx.dispatch(new SetLoading(BaselayerState, false))
        return of(err)
      })
    )
  }
}
