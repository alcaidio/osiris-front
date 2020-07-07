import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterModule } from '@angular/router'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { TreoCardModule } from '@treo/components/card'
import { TreoMessageModule } from '@treo/components/message'
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component'
import { authSignInRoutes } from 'app/modules/auth/sign-in/sign-in.routing'
import { SharedModule } from 'app/shared/shared.module'

@NgModule({
  declarations: [AuthSignInComponent],
  imports: [
    RouterModule.forChild(authSignInRoutes),
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
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'sign-in' }],
})
export class AuthSignInModule {}
