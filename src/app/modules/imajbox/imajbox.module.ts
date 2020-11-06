import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from '../../../environments/environment'
import { SharedModule } from '../../shared/shared.module'
import * as fromComponents from './components'
import { ImajboxRoutingModule } from './imajbox-routing.module'
import { ImajboxComponent } from './imajbox.component'

@NgModule({
  declarations: [ImajboxComponent, ...fromComponents.components],
  imports: [
    CommonModule,
    SharedModule,
    ImajboxRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  providers: [MapService],
})
export class ImajboxModule {}
