import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'
import { TreoCardModule } from '../../../../@treo/components/card/card.module'
import { SharedModule } from '../../../shared/shared.module'
import { AuthConfirmationRequiredComponent } from './confirmation-required.component'
import { authConfirmationRequiredRoutes } from './confirmation-required.routing'

@NgModule({
  declarations: [AuthConfirmationRequiredComponent],
  imports: [RouterModule.forChild(authConfirmationRequiredRoutes), MatButtonModule, TreoCardModule, SharedModule],
})
export class AuthConfirmationRequiredModule {}
