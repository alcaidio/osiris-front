import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RoadviewComponent } from './roadview.component'

const routes: Routes = [
  {
    path: '',
    component: RoadviewComponent,
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
export class RoadviewRoutingModule {}
