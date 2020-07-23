import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterModule } from '@angular/router'
import { TreoCardModule } from '../../../../@treo/components/card/card.module'
import { TreoMessageModule } from '../../../../@treo/components/message/message.module'
import { SharedModule } from '../../../shared/shared.module'
import { AuthUnlockSessionComponent } from './unlock-session.component'
import { authUnlockSessionRoutes } from './unlock-session.routing'

@NgModule({
  declarations: [AuthUnlockSessionComponent],
  imports: [
    RouterModule.forChild(authUnlockSessionRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
  ],
})
export class AuthUnlockSessionModule {}
