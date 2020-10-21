import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MapsListComponent } from './containers/maps-list.component'
import { MapsRoutingModule } from './maps-routing.module'
import { MapsComponent } from './maps.component'


@NgModule({
  declarations: [MapsListComponent, MapsComponent],
  imports: [
    CommonModule,
    MapsRoutingModule
  ]
})
export class MapsModule { }
