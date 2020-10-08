import { NgModule } from '@angular/core'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from './../../../../environments/environment'
import { SharedModule } from './../../../shared/shared.module';
import { ImageComponent } from './containers/image/image.component'

@NgModule({
  declarations: [ImageComponent],
  imports: [
    SharedModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
})
export class ImageModule {}
