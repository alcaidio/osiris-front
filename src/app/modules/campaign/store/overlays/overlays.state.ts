import { Injectable } from '@angular/core'
import {
  CreateOrReplace,
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
import { Overlay } from '../../model/campaign.model'
import { ApiService } from '../../services/api.service'
import { GetOverlays, ToggleOverlay } from './overlays.actions'

@State<EntityStateModel<Overlay>>({
  name: 'overlays',
  defaults: defaultEntityState(),
})
@Injectable()
export class OverlayState extends EntityState<Overlay> {
  constructor(private api: ApiService) {
    super(OverlayState, 'id', IdStrategy.EntityIdGenerator)
  }

  @Selector()
  static getActiveOverlayFeatures(state: EntityStateModel<Overlay>) {
    return state.entities[state.active].features
  }

  @Selector()
  static getActiveFeatureTypeModel(state: EntityStateModel<Overlay>) {
    return state.entities[state.active].featureTypeModel
  }

  @Selector()
  static getIsTraceImageExist(state: EntityStateModel<Overlay>) {
    return Object.values(state.entities).some((o) => o.module.toUpperCase() === 'PICTURES' && o.visible)
  }

  @Action(GetOverlays)
  getOverlays(ctx: StateContext<OverlayState>, action: GetOverlays) {
    ctx.dispatch(new SetLoading(OverlayState, true))

    return this.api.getOverlaysByMapId(action.mapId).pipe(
      map((overlays: Overlay[]) => {
        ctx.dispatch(new CreateOrReplace(OverlayState, overlays))
        ctx.dispatch(new SetLoading(OverlayState, false))
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
