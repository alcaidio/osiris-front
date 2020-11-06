import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from './../../../environments/environment'
import { SharedModule } from './../../shared/shared.module'
import * as fromComponents from './components'
import { RoadviewRoutingModule } from './roadview-routing.module'
import { RoadviewComponent } from './roadview.component'
import { MarzipanoService } from './services/marzipano.service'

@NgModule({
  declarations: [RoadviewComponent, ...fromComponents.components],
  imports: [
    CommonModule,
    SharedModule,
    RoadviewRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  providers: [MarzipanoService, MapService],
})
export class RoadviewModule {}
