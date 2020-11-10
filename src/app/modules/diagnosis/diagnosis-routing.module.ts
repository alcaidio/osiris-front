import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SectionInfosComponent } from './containers/section-infos.component'
import { DiagnosisComponent } from './diagnosis.component'
import { CanDeactivateSectionDetails } from './guards/section.guard'

const routes: Routes = [
  {
    path: '',
    component: DiagnosisComponent,
    children: [
      {
        path: 'section/:id',
        children: [
          { path: '', redirectTo: 'infos', pathMatch: 'full' },
          {
            path: 'infos',
            component: SectionInfosComponent,
            canDeactivate: [CanDeactivateSectionDetails],
          },
          // TODO add other path for the drawer section
        ],
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
