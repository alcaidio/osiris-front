import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { environment } from 'environments/environment'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { ButtonsMenuComponent } from './components/buttons-menu.component'
import { DrawerSwitchComponent } from './components/drawer-switch.component'
import { LayerComponent } from './components/layer.component'
import { MapDetailsComponent } from './components/map-details.component'
import { FilterDetailsComponent } from './containers/filter-details.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionInfosComponent } from './containers/section-infos.component'
import { MapRoutingModule } from './map.routing'
import { MapStates } from './store'

@NgModule({
  declarations: [
    CustomMapComponent,
    LayerComponent,
    SectionInfosComponent,
    FilterDetailsComponent,
    ButtonsMenuComponent,
    DrawerSwitchComponent,
    MapDetailsComponent,
  ],
  imports: [
    SharedModule,
    MapRoutingModule,
    NgxsModule.forFeature(MapStates),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  providers: [MapService],
})
export class MapModule {}
