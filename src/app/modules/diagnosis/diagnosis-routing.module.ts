import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SectionInfosComponent } from './containers/section-infos.component'
import { DiagnosisComponent } from './diagnosis.component'

const routes: Routes = [
  {
    path: '',
    component: DiagnosisComponent,
    children: [
      {
        path: 'section/:id',
        // canDeactivate: [CanDeactivateSectionDetails],
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
export class DiagnosisRoutingModule {}
