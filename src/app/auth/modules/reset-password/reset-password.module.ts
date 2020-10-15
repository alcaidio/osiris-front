import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TreoCardModule } from '../../../../@treo/components/card/card.module'
import { TreoMessageModule } from '../../../../@treo/components/message/message.module'
import { SharedModule } from '../../../shared/shared.module'
import { AuthResetPasswordComponent } from './reset-password.component'
import { authResetPasswordRoutes } from './reset-password.routing'

@NgModule({
  declarations: [AuthResetPasswordComponent],
  imports: [
    RouterModule.forChild(authResetPasswordRoutes),
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
  ],
})
export class AuthResetPasswordModule {}
