import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'
import { CanDeactivateSectionDetails } from './guards/section.guards'
import { LayersResolver, SectionResolver } from './resolvers/section.resolvers'

const routes: Routes = [
  { path: '', redirectTo: 'sections', pathMatch: 'full' },
  {
    path: 'sections',
    component: CustomMapComponent,
    resolve: { layers: LayersResolver },
    children: [
      {
        path: ':id',
        component: SectionDetailsComponent,
        resolve: {
          section: SectionResolver,
        },
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
