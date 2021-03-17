import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { CampaignRoutingModule } from './campaign.routing'
import * as fromComponents from './components'
import * as fromContainers from './containers'
import * as fromDirectives from './directives'
import * as fromPipes from './pipes'
import * as fromServices from './services'
import { CampaignModuleStates } from './store'

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
    ...fromPipes.pipes,
    ...fromDirectives.directives,
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    SharedModule,
    LeafletModule,
    LeafletDrawModule,
    NgxsModule.forFeature(CampaignModuleStates),
  ],
  providers: [...fromServices.services],
})
export class CampaignModule {}
