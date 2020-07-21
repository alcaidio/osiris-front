import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule } from '@angular/material/tooltip'
import { environment } from 'environments/environment'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { LayerComponent } from './components/layer.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'
import { MapRoutingModule } from './map.routing'

const MATERIAL = [MatIconModule, MatButtonModule, MatMenuModule, MatSidenavModule, MatTooltipModule, MatDividerModule]

@NgModule({
  declarations: [CustomMapComponent, LayerComponent, SectionDetailsComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
    ...MATERIAL,
  ],
})
export class MapModule {}
