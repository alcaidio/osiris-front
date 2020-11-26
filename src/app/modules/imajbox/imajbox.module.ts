import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from '../../../environments/environment'
import { SharedModule } from '../../shared/shared.module'
import * as fromComponents from './components'
import * as fromContainers from './containers'
import { ImajboxRoutingModule } from './imajbox-routing.module'
import { ImajboxStates } from './store'

@NgModule({
  declarations: [...fromContainers.containers, ...fromComponents.components],
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
