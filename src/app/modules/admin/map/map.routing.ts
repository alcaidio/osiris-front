import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomMapComponent } from './containers/map.component'
import { SectionDetailsComponent } from './containers/section-details.component'

const routes: Routes = [
  {
    path: '',
    component: CustomMapComponent,
    children: [
      { path: '', redirectTo: 'sections' },
      {
        path: 'sections',
        component: CustomMapComponent,
      },
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
