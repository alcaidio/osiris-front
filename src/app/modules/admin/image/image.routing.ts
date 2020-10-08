import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ImageComponent } from './containers/image/image.component'

const routes: Routes = [
  {
    path: '',
    component: ImageComponent,
    // children: [],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageRoutingModule {}
