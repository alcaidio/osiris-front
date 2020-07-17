import { Route } from '@angular/router'
import { InitialDataResolver } from 'app/app.resolvers'
import { AuthGuard } from 'app/core/auth/guards/auth.guard'
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'
import { LayoutComponent } from 'app/layout/layout.component'

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  { path: '', pathMatch: 'full', redirectTo: 'map' },

  // Redirect signed in user to the '/example'
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'map' },

  // Auth routes (guest)
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () =>
          import('app/modules/auth/confirmation-required/confirmation-required.module').then(
            (m) => m.AuthConfirmationRequiredModule
          ),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('app/modules/auth/forgot-password/forgot-password.module').then((m) => m.AuthForgotPasswordModule),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('app/modules/auth/reset-password/reset-password.module').then((m) => m.AuthResetPasswordModule),
      },
      {
        path: 'sign-in',
        loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then((m) => m.AuthSignInModule),
      },
      {
        path: 'sign-up',
        loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then((m) => m.AuthSignUpModule),
      },
    ],
  },

  // Auth routes (logged in)
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then((m) => m.AuthSignOutModule),
      },
      {
        path: 'unlock-session',
        loadChildren: () =>
          import('app/modules/auth/unlock-session/unlock-session.module').then((m) => m.AuthUnlockSessionModule),
      },
    ],
  },

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
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
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
      { path: '**', redirectTo: '404-not-found' },
    ],
  },
]
