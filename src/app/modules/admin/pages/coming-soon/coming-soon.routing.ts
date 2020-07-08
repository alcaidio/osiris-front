import { Route } from '@angular/router'
import { ComingSoonComponent } from './coming-soon.component'

export const comingSoonRoutes: Route[] = [
  // Redirect empty route
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'classic',
  },
  // // Use 'empty' layout on 'fullscreen' style
  // {
  //   path: 'fullscreen',
  //   component: ComingSoonComponent,
  //   data: {
  //     layout: 'empty',
  //   },
  // },
  // // Use 'empty' layout on 'fullscreen-alt' style
  // {
  //   path: 'fullscreen-alt',
  //   component: ComingSoonComponent,
  //   data: {
  //     layout: 'empty',
  //   },
  // },
  // Use defaults on other styles
  {
    path: '**',
    component: ComingSoonComponent,
  },
]
