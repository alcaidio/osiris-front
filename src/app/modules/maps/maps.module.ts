import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { environment } from 'app/../environments/environment'
import { SharedModule } from 'app/shared/shared.module'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import * as fromComponents from './components'
import * as fromContainers from './containers'
import { MapsRoutingModule } from './maps-routing.module'
import { MapsComponent } from './maps.component'

@NgModule({
  declarations: [MapsComponent, ...fromComponents.components, ...fromContainers.containers],
  imports: [
    CommonModule,
    MapsRoutingModule,
    SharedModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
})
export class MapsModule {}
