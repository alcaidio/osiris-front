import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgxsModule } from '@ngxs/store'
import { environment } from 'environments/environment'
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { FilterDetailsComponent } from './components/filter-details.component'
import { LayerComponent } from './components/layer.component'
import { ButtonsMenuComponent } from './containers/buttons-menu.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'
import { MapRoutingModule } from './map.routing'
import { MapStates } from './store'

const MATERIAL = [
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatSidenavModule,
  MatTooltipModule,
  MatDividerModule,
  MatCheckboxModule,
  MatListModule,
]

@NgModule({
  declarations: [
    CustomMapComponent,
    LayerComponent,
    SectionDetailsComponent,
    FilterDetailsComponent,
    ButtonsMenuComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    NgxsModule.forFeature(MapStates),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
    ...MATERIAL,
  ],
  providers: [MapService],
})
export class MapModule {}
