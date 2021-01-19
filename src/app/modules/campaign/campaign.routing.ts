import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CampaignDetailComponent } from './containers/campaign-detail/campaign-detail.component'
import { CampaignListComponent } from './containers/campaign-list/campaign-list.component'
import { CampaignResolver, MapSmallResolver } from './resolvers/campaign.resolvers'

const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent,
  },
  {
    path: ':id',
    component: CampaignDetailComponent,
    resolve: { campaign: CampaignResolver, mapSmall: MapSmallResolver },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}
