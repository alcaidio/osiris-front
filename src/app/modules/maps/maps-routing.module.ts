import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import * as fromContainers from './containers'
import { MapsListComponent } from './containers/maps-list.component'

const routes: Routes = [
  {
    path: '',
    component: MapsListComponent,
  },
  {
    path: 'diagnosis',
    loadChildren: () => import('./modules/diagnosis/diagnosis.module').then((m) => m.DiagnosisModule),
  },
  {
    path: 'imajebox',
    component: fromContainers.ImajeboxComponent,
  },
  {
    path: 'roadview',
    component: fromContainers.RoadviewComponent,
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
export class MapsRoutingModule {}
