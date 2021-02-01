import { Injectable } from '@angular/core'
import {
  Add,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  SetError,
  SetLoading,
  Update,
} from '@ngxs-labs/entity-state'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Overlay } from '../../model/shared.model'
import { ApiService } from '../../services/api.service'
import { GetOverlays, ToggleOverlay } from './overlays.actions'

@State<EntityStateModel<Overlay>>({
  name: 'overlays',
  defaults: defaultEntityState(),
})
@Injectable()
export class OverlayState extends EntityState<Overlay> {
  constructor(private api: ApiService) {
    super(OverlayState, 'name', IdStrategy.EntityIdGenerator)
  }

  @Selector()
  static getVisibleOverlays(state: EntityStateModel<Overlay>) {
    return Object.values(state.entities).filter((o) => o.visible === true)
  }

  @Action(GetOverlays)
  getOverlays(ctx: StateContext<OverlayState>, action: GetOverlays) {
    ctx.dispatch(new SetLoading(OverlayState, true))

    return this.api.getOverlays(action.overlayIds).pipe(
      map((overlays: Overlay[]) => {
        const state = ctx.getState()
        if (state['ids'] && state['ids'].length > 0) {
          const newOverlays = overlays.filter((item) => state['ids'].includes(item))
          if (newOverlays.length > 0) {
            ctx.dispatch(new Add(OverlayState, overlays))
          }
        } else {
          ctx.dispatch(new Add(OverlayState, overlays))
        }

        // REMOVE: Simulation latence
        setTimeout(() => {
          ctx.dispatch(new SetLoading(OverlayState, false))
        }, 200)
      }),
      catchError((err) => {
        ctx.dispatch(new SetError(OverlayState, err))
        ctx.dispatch(new SetLoading(OverlayState, false))
        return of(err)
      })
    )
  }

  @Action(ToggleOverlay)
  toggle(ctx: StateContext<OverlayState>, action: ToggleOverlay) {
    ctx.dispatch(new Update(OverlayState, action.payload.id as string, { visible: !action.payload.visible }))
  }
}
