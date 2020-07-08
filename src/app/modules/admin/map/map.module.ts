import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { environment } from 'environments/environment'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { MapComponent } from './map.component'
import { MapRoutingModule } from './map.routing'

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
})
export class MapModule {}
