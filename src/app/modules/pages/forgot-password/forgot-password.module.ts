import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { TreoCardModule } from '@treo/components/card'
import { TreoMessageModule } from '@treo/components/message'
import { SharedModule } from 'app/shared/shared.module'
import { AuthForgotPasswordComponent } from './forgot-password.component'
import { authForgotPasswordRoutes } from './forgot-password.routing'

@NgModule({
  declarations: [AuthForgotPasswordComponent],
  imports: [
    RouterModule.forChild(authForgotPasswordRoutes),
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'forgot-password' }],
})
export class AuthForgotPasswordModule {}
