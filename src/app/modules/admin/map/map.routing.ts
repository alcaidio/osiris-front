import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'
import { MapSectionsResolver } from './map.resolvers'

const routes: Routes = [
  {
    path: '',
    component: CustomMapComponent,
    resolve: {
      map: MapSectionsResolver,
    },
    children: [
      {
        path: 'section/:id',
        component: SectionDetailsComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
