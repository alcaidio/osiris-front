import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { TreoCardModule } from '@treo/components/card'
import { SharedModule } from 'app/shared/shared.module'
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component'
import { authSignOutRoutes } from 'app/modules/auth/sign-out/sign-out.routing'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'

@NgModule({
  declarations: [AuthSignOutComponent],
  imports: [RouterModule.forChild(authSignOutRoutes), MatButtonModule, TreoCardModule, SharedModule],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'sign-out' }],
})
export class AuthSignOutModule {}
