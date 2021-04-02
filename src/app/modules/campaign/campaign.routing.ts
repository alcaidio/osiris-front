import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CampaignDetailComponent } from './containers/campaign-detail/campaign-detail.component'
import { CampaignListComponent } from './containers/campaign-list/campaign-list.component'
import { CampaignResolver, MapSmallResolver, StatsResolver } from './resolvers/campaign.resolvers'

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
  {
    path: ':id/stats',
    loadChildren: () => import('../stats/stats.module').then((m) => m.StatsModule),
    resolve: { stats: StatsResolver },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}
