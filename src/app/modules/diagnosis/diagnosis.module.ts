import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { NgxsModule } from '@ngxs/store'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from '../../../environments/environment'
import { SharedModule } from '../../shared/shared.module'
import * as fromComponents from './components'
import { MapMenuComponent } from './components/map-menu.component'
import * as fromContainers from './containers'
import { DiagnosisRoutingModule } from './diagnosis-routing.module'
import { DiagnosisStates } from './store'

@NgModule({
  declarations: [...fromContainers.containers, ...fromComponents.components, MapMenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    DiagnosisRoutingModule,
    NgxsModule.forFeature(DiagnosisStates),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  providers: [MapService, { provide: TRANSLOCO_SCOPE, useValue: 'diagnosis' }],
})
export class DiagnosisModule {}
