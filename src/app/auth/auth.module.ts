import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

const COMPONENTS = []

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AuthModule {}
