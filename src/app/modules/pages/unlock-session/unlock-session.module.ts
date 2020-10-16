import { NgModule } from '@angular/core'
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
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
  ],
})
export class AuthUnlockSessionModule {}
