import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { environment } from 'environments/environment'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { LayerComponent } from './components/layer.component'
import { MapComponent } from './containers/map.component'
import { MapRoutingModule } from './map.routing'

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
