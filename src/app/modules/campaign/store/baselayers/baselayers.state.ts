import { Injectable } from '@angular/core'
import {
  Add,
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

    return this.api.getBaselayers(action.baselayerIds).pipe(
      map((baselayers: BaseLayer[]) => {
        const state = ctx.getState()
        if (state['ids'] && state['ids'].length > 0) {
          const newBaselayers = baselayers.filter((item) => state['ids'].includes(item))
          if (newBaselayers.length > 0) {
            ctx.dispatch(new Add(BaselayerState, baselayers))
          }
        } else {
          ctx.dispatch(new Add(BaselayerState, baselayers))
        }

        // REMOVE: Simulation latence
        setTimeout(() => {
          ctx.dispatch(new SetLoading(BaselayerState, false))
        }, 300)
      }),
      catchError((err) => {
        ctx.dispatch(new SetError(BaselayerState, err))
        ctx.dispatch(new SetLoading(BaselayerState, false))
        return of(err)
      })
    )
  }
}
