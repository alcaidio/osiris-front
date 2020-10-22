import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from './../../../shared/shared.module'
import { MapItemComponent } from './components/map-item.component'
import { MapsListComponent } from './containers/maps-list.component'
import { MapsRoutingModule } from './maps-routing.module'
import { MapsComponent } from './maps.component'


@NgModule({
  declarations: [MapsListComponent, MapsComponent, MapItemComponent],
  imports: [
    CommonModule,
    MapsRoutingModule, 
    SharedModule
  ]
})
export class MapsModule { }
