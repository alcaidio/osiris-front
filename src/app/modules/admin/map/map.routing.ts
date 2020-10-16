import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LayersComponent } from './containers/layers.component'
import { MapDetailsComponent } from './containers/map-details.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionInfosComponent } from './containers/section-infos.component'
import { CanDeactivateSectionDetails } from './guards/section.guards'

const routes: Routes = [
  {
    path: '',
    component: CustomMapComponent,
    children: [
      {
        path: '',
        component: MapDetailsComponent,
      },
      {
        path: 'layers',
        component: LayersComponent,
      },
      {
        path: 'section/:id',
        canDeactivate: [CanDeactivateSectionDetails],
        children: [
          { path: '', redirectTo: 'infos', pathMatch: 'full' },
          {
            path: 'infos',
            component: SectionInfosComponent,
          },
          // TODO add other path for the drawer section
        ],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
