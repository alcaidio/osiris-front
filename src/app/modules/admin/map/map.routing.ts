import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MapComponent } from './containers/map.component'
import { MapSectionsResolver } from './map.resolvers'

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    resolve: {
      map: MapSectionsResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
