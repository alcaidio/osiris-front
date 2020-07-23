import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { AuthStates } from './store'

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature(AuthStates)],
})
export class AuthModule {}
