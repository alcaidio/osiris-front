import { NgModule } from '@angular/core'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { environment } from 'environments/environment'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { BuildingsComponent } from './components/buildings.component'
import { ButtonsMenuComponent } from './components/buttons-menu.component'
import { DrawerSwitchComponent } from './components/drawer-switch.component'
import { LayerComponent } from './components/layer.component'
import { MapDetailsComponent } from './components/map-details.component'
import { MapToolsComponent } from './components/map-tools.component'
import { SwitchMapStyleComponent } from './components/switch-map-style.component'
import { FilterDetailsComponent } from './containers/filter-details.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionInfosComponent } from './containers/section-infos.component'
import { MapRoutingModule } from './map.routing'
import { MapStates } from './store';
import { LayerGeojsonComponent } from './components/layer-geojson.component'

@NgModule({
  declarations: [
    CustomMapComponent,
    LayerComponent,
    SectionInfosComponent,
    FilterDetailsComponent,
    ButtonsMenuComponent,
    DrawerSwitchComponent,
    MapDetailsComponent,
    SwitchMapStyleComponent,
    MapToolsComponent,
    BuildingsComponent,
    LayerGeojsonComponent,
  ],
  imports: [
    SharedModule,
    MapRoutingModule,
    NgxsModule.forFeature(MapStates),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  providers: [MapService, { provide: TRANSLOCO_SCOPE, useValue: 'map' }],
})
export class MapModule {}
