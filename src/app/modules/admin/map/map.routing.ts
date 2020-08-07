import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FilterDetailsComponent } from './components/filter-details.component'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'
import { CanDeactivateSectionDetails } from './guards/section.guards'
import { SectionResolver } from './resolvers/section.resolvers'

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
        resolve: { section: SectionResolver },
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
