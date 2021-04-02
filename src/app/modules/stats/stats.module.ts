import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { NgApexchartsModule } from 'ng-apexcharts'
import * as fromComponents from './components'
import * as fromContainers from './containers'
import { StatsRoutingModule } from './stats-routing.module'
import { StatsModuleStates } from './store'

@NgModule({
  declarations: [...fromComponents.components, ...fromContainers.containers],
  imports: [
    CommonModule,
    StatsRoutingModule,
    SharedModule,
    NgApexchartsModule,
    NgxsModule.forFeature(StatsModuleStates),
  ],
})
export class StatsModule {}
