import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ImajboxComponent } from './imajbox.component'

const routes: Routes = [
  {
    path: '',
    component: ImajboxComponent,
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
export class ImajboxRoutingModule {}
