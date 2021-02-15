import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { CampaignRoutingModule } from './campaign.routing'
import { BaselayerListComponent } from './components/baselayer-list/baselayer-list.component'
import { CalqueListComponent } from './components/calque-list/calque-list.component'
import { CalqueComponent } from './components/calque/calque.component'
import { DialogComponent } from './components/dialog/dialog.component'
import { MapCardComponent } from './components/map-card/map-card.component'
import { MapSelectionComponent } from './components/map-tools/map-tools.component'
import { MapComponent } from './components/map/map.component'
import { PopupContentComponent } from './components/popup-content/popup-content.component'
import { PropertyTypeComponent } from './components/property-type/property-type.component'
import { PropertyValueComponent } from './components/property-value/property-value.component'
import { TableCalqueComponent } from './components/table-calque/table-calque.component'
import { CampaignDetailComponent } from './containers/campaign-detail/campaign-detail.component'
import { CampaignListComponent } from './containers/campaign-list/campaign-list.component'
import { CustomDirective } from './directives/custom.directive'
import { TitlePipe, TruncatePipe } from './pipe'
import { CampaignModuleStates } from './store'

@NgModule({
  declarations: [
    MapComponent,
    CampaignDetailComponent,
    PopupContentComponent,
    CampaignListComponent,
    CustomDirective,
    BaselayerListComponent,
    CalqueComponent,
    TruncatePipe,
    TitlePipe,
    CalqueListComponent,
    PropertyTypeComponent,
    PropertyValueComponent,
    MapCardComponent,
    TableCalqueComponent,
    DialogComponent,
    MapSelectionComponent,
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
