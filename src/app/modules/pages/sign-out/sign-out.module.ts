import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { AuthSignOutComponent } from '../sign-out/sign-out.component'
import { authSignOutRoutes } from '../sign-out/sign-out.routing'
import { TreoCardModule } from './../../../../@treo/components/card/card.module'
import { SharedModule } from './../../../shared/shared.module'

@NgModule({
  declarations: [AuthSignOutComponent],
  imports: [RouterModule.forChild(authSignOutRoutes), MatButtonModule, TreoCardModule, SharedModule],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'sign-out' }],
})
export class AuthSignOutModule {}
