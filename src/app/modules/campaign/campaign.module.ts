import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { CampaignRoutingModule } from './campaign.routing'
import { BaselayerListComponent } from './components/baselayer-list/baselayer-list.component'
import { MapComponent } from './components/map/map.component'
import { MenuComponent } from './components/menu/menu.component'
import { OverlayListComponent } from './components/overlay-list/overlay-list.component'
import { PopupContentComponent } from './components/popup-content/popup-content.component'
import { CampaignDetailComponent } from './containers/campaign-detail/campaign-detail.component'
import { CampaignListComponent } from './containers/campaign-list/campaign-list.component'
import { CustomDirective } from './directives/custom.directive'
import { CampaignModuleStates } from './store'

@NgModule({
  declarations: [
    MapComponent,
    CampaignDetailComponent,
    PopupContentComponent,
    CampaignListComponent,
    CustomDirective,
    BaselayerListComponent,
    OverlayListComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    SharedModule,
    LeafletModule,
    LeafletDrawModule,
    NgxsModule.forFeature(CampaignModuleStates),
  ],
})
export class CampaignModule {}
