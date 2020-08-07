import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FilterDetailsComponent } from './components/filter-details.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'
import { CanDeactivateSectionDetails } from './guards/section.guards'

const routes: Routes = [
  {
    path: '',
    component: CustomMapComponent,
    children: [
      {
        path: 'filter',
        component: FilterDetailsComponent,
      },
      {
        path: 'section/:id',
        component: SectionDetailsComponent,
        canDeactivate: [CanDeactivateSectionDetails],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
