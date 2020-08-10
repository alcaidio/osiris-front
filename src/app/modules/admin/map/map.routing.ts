import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MapDetailsComponent } from './components/map-details.component'
import { FilterDetailsComponent } from './containers/filter-details.component'
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
        path: 'filter',
        component: FilterDetailsComponent,
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
