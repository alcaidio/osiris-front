import { Route } from '@angular/router'
import { AuthGuard } from 'app/auth/guards/auth.guard'
import { ComingSoonComponent } from './coming-soon.component'

export const comingSoonRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'soon',
  },
  {
    path: 'soon',
    component: ComingSoonComponent,
    canActivate: [AuthGuard],
  },
]
