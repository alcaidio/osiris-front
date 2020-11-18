import { Route } from '@angular/router'
import { AuthResetPasswordComponent } from './reset-password.component'
import { ResetPasswordGuard } from './reset-password.guard'

export const authResetPasswordRoutes: Route[] = [
  {
    path: '',
    component: AuthResetPasswordComponent,
    resolve: { payload: ResetPasswordGuard },
  },
]
