import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from '../../../environments/environment'
import { SharedModule } from '../../shared/shared.module'
import * as fromComponents from './components'
import { CarCompassComponent } from './components/car-compass.component'
import { ImajboxRoutingModule } from './imajbox-routing.module'
import { ImajboxComponent } from './imajbox.component'
import { ImajboxStates } from './store'

@NgModule({
  declarations: [ImajboxComponent, ...fromComponents.components, CarCompassComponent],
  imports: [
    CommonModule,
    SharedModule,
    ImajboxRoutingModule,
    NgxsModule.forFeature(ImajboxStates),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  providers: [MapService],
})
export class ImajboxModule {}
