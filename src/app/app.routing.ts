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
    // canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'map',
        loadChildren: () => import('./modules/admin/map/map.module').then((m) => m.MapModule),
        data : { title : 'Map' }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data : { title : 'Dashboard' }
      },
      {
        path: 'works',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data : { title : 'Travaux' }
      },
      {
        path: 'settings',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data : { title : 'Settings' }
      },
      {
        path: 'profile',
        loadChildren: () => import('app/modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data : { title : 'Profile' }
      },
      { 
        path: '404', 
        loadChildren: () => import('app/modules/pages/errors/error-404/error-404.module').then((m) => m.Error404Module)
      },
      { path: '**', pathMatch: 'full', redirectTo: '404' },
    ],
  },

  { 
    path: 'error', 
    children: [
      { path: '', pathMatch: 'full', redirectTo: '404' },
      { 
        path: '404', 
        loadChildren: () => import('app/modules/pages/errors/error-404/error-404.module').then((m) => m.Error404Module)
      },
      { 
        path: '500', 
        loadChildren: () => import('app/modules/pages/errors/error-500/error-500.module').then((m) => m.Error500Module)
      },
    ]
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
