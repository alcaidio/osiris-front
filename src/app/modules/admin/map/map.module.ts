import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule } from '@angular/material/tooltip'
import { environment } from 'environments/environment'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { LayerComponent } from './components/layer.component'
import { MapComponent } from './containers/map.component'
import { MapRoutingModule } from './map.routing'

const MATERIAL = [MatIconModule, MatButtonModule, MatMenuModule, MatSidenavModule, MatTooltipModule]

@NgModule({
  declarations: [MapComponent, LayerComponent],
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
