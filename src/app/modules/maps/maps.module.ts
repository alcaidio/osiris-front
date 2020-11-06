import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from 'app/shared/shared.module'
import * as fromComponents from './components'
import * as fromContainers from './containers'
import { MapsRoutingModule } from './maps-routing.module'
import { MapsComponent } from './maps.component'

@NgModule({
  declarations: [MapsComponent, ...fromComponents.components, ...fromContainers.containers],
  imports: [CommonModule, MapsRoutingModule, SharedModule],
})
export class MapsModule {}
