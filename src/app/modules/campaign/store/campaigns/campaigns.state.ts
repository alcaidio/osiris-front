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
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store'
import { catchError, map } from 'rxjs/operators'
import { Campaign } from '../../model/campaign.model'
import { ApiService } from '../../services/api.service'
import { GetAllCampaigns } from './campaigns.actions'

@State<EntityStateModel<Campaign>>({
  name: 'campaigns',
  defaults: defaultEntityState(),
})
@Injectable()
export class CampaignsState extends EntityState<Campaign> implements NgxsOnInit {
  constructor(private api: ApiService) {
    super(CampaignsState, 'id', IdStrategy.EntityIdGenerator)
  }

  ngxsOnInit(ctx: StateContext<CampaignsState>): void {
    ctx.dispatch(new GetAllCampaigns())
  }

  @Action(GetAllCampaigns)
  getAll(ctx: StateContext<CampaignsState>) {
    ctx.dispatch(new SetLoading(CampaignsState, true))

    return this.api.getCampaignList().pipe(
      map((campaigns: Campaign[]) => {
        ctx.dispatch(new CreateOrReplace(CampaignsState, campaigns))
        ctx.dispatch(new SetLoading(CampaignsState, false))
      }),
      catchError((err) => {
        ctx.dispatch(new SetLoading(CampaignsState, false))
        return ctx.dispatch(new SetError(CampaignsState, err))
      })
    )
  }
}
