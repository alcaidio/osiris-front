import { Component } from '@angular/core'
import { Select } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Campaign } from '../../model/shared.model'
import { CampaignsState } from '../../store/campaigns/campaigns.state'

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent {
  @Select(CampaignsState.entities) campaigns$: Observable<Campaign[]>
  @Select(CampaignsState.loading) loading$: Observable<boolean>
}
