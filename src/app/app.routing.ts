import { NgModule } from '@angular/core'
import { ExtraOptions, Params, PreloadAllModules, Route, RouterModule, RouterStateSnapshot } from '@angular/router'
import { RouterStateSerializer } from '@ngxs/router-plugin'
import { InitialDataResolver } from 'app/app.resolvers'
import { LayoutComponent } from 'app/layout/layout.component'
import { AuthGuard } from './auth/guards/auth.guard'

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: PreloadAllModules,
}

// @formatter:off
// tslint:disable:max-line-length
export const routes: Route[] = [
  // Redirect empty path to '/map'
  { path: '', pathMatch: 'full', redirectTo: 'map' },

  // Redirect signed in user to the '/map'
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'map' },

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
      {
        path: 'map',
        loadChildren: () => import('./modules/admin/map/map.module').then((m) => m.MapModule),
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

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export interface RouterStateParams {
  url: string
  params: Params
  queryParams: Params
}

// Map the router snapshot to { url, params, queryParams }
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateParams> {
  serialize(routerState: RouterStateSnapshot): RouterStateParams {
    const {
      url,
      root: { queryParams },
    } = routerState

    let { root: route } = routerState
    while (route.firstChild) {
      route = route.firstChild
    }

    const { params } = route

    return { url, params, queryParams }
  }
}
