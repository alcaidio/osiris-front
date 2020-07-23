import { Route } from '@angular/router'
import { InitialDataResolver } from 'app/app.resolvers'
import { LayoutComponent } from 'app/layout/layout.component'
import { AuthGuard } from './auth/guards/auth.guard'

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  { path: '', pathMatch: 'full', redirectTo: 'map' },

  // Redirect signed in user to the '/example'
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'map' },

  // Landing routes
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'home',
        loadChildren: () => import('app/modules/landing/home/home.module').then((m) => m.LandingHomeModule),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      // Example
      {
        path: 'map',
        loadChildren: () => import('app/modules/admin/map/map.module').then((m) => m.MapModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
      },
      {
        path: 'works',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('app/modules/admin/settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
      },
      {
        path: '404-not-found',
        pathMatch: 'full',
        loadChildren: () => import('app/modules/pages/errors/error-404/error-404.module').then((m) => m.Error404Module),
      },
      // { path: '**', redirectTo: '404-not-found' },
    ],
  },
]
