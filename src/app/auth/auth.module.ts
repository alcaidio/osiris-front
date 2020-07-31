import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { AuthRoutingModule } from './auth-routing.module'
import { AuthStates } from './store'

@NgModule({
  imports: [CommonModule, AuthRoutingModule, NgxsModule.forFeature(AuthStates)],
})
export class AuthModule {}
