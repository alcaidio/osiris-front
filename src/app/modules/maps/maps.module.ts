import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from 'app/shared/shared.module'
import { NgxImageZoomModule } from 'ngx-image-zoom'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from './../../../environments/environment'
import { MapImageComponent } from './components/map-image.component'
import { MapItemComponent } from './components/map-item.component'
import { ImageMapBisComponent } from './containers/image-map-bis.component'
import { ImageMapComponent } from './containers/image-map.component'
import { MapsListComponent } from './containers/maps-list.component'
import { MapsRoutingModule } from './maps-routing.module'
import { MapsComponent } from './maps.component'


@NgModule({
  declarations: [MapsListComponent, MapsComponent, MapItemComponent, ImageMapComponent, MapImageComponent, ImageMapBisComponent],
  imports: [
    CommonModule,
    MapsRoutingModule, 
    SharedModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
    NgxImageZoomModule
  ]
})
export class MapsModule { }
