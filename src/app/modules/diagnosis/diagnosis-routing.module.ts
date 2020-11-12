import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import * as fromContainers from './containers'

const routes: Routes = [
  {
    path: '',
    component: fromContainers.DiagnosisComponent,
    children: [
      {
        path: 'section/:id',
        component: fromContainers.SectionInfosComponent,
      },
      {
        path: 'overlays',
        component: fromContainers.OverlaysComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosisRoutingModule {}
