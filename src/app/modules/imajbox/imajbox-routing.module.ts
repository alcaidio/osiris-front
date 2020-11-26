import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SplitViewComponent } from './containers/split-view.component'
import { ImajboxComponent } from './containers/imajbox.component'

const routes: Routes = [
  {
    path: '',
    component: ImajboxComponent,
  },
  {
    path: 'split',
    component: SplitViewComponent,
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
