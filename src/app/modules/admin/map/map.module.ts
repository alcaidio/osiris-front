import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { environment } from 'environments/environment'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { MapComponent } from './map.component'
import { MapRoutingModule } from './map.routing'
import { LayerComponent } from './components/layer.component'

@NgModule({
  declarations: [MapComponent, LayerComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
})
export class MapModule {}
