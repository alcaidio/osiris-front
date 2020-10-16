import { NgModule } from '@angular/core'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { NgxsModule } from '@ngxs/store'
import { SharedModule } from 'app/shared/shared.module'
import { environment } from 'environments/environment'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { BuildingsComponent } from './components/buildings.component'
import { ButtonFabMapComponent } from './components/button-fab-map.component'
import { ButtonsMenuComponent } from './components/buttons-menu.component'
import { DrawerSwitchComponent } from './components/drawer-switch.component'
import { LayerComponent } from './components/layer.component'
import { MapDrawerComponent } from './components/map-drawer.component'
import { LayersComponent } from './containers/layers.component'
import { MapDetailsComponent } from './containers/map-details.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionInfosComponent } from './containers/section-infos.component'
import { MapRoutingModule } from './map.routing'
import { MapStates } from './store';
import { TreeListComponent } from './components/tree-list/tree-list.component'

@NgModule({
  declarations: [
    CustomMapComponent,
    LayerComponent,
    SectionInfosComponent,
    LayersComponent,
    ButtonsMenuComponent,
    DrawerSwitchComponent,
    MapDetailsComponent,
    BuildingsComponent,
    ButtonFabMapComponent,
    MapDrawerComponent,
    TreeListComponent,
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
