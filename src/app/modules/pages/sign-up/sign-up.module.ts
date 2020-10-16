import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterModule } from '@angular/router'
import { TreoCardModule } from '../../../../@treo/components/card/card.module'
import { TreoMessageModule } from '../../../../@treo/components/message/message.module'
import { SharedModule } from '../../../shared/shared.module'
import { AuthSignUpComponent } from './sign-up.component'
import { authSignupRoutes } from './sign-up.routing'

@NgModule({
  declarations: [AuthSignUpComponent],
  imports: [
    RouterModule.forChild(authSignupRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
  ],
})
export class AuthSignUpModule {}
