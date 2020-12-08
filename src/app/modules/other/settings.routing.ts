import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DemoContentComponent } from './components/demo-content/demo-content.component'
import { SettingsComponent } from './containers/settings.component'

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'workspace' },
      {
        path: 'workspace',
        component: DemoContentComponent,
      },
      {
        path: 'users',
        component: DemoContentComponent,
      },
      {
        path: 'billing',
        component: DemoContentComponent,
      },
      {
        path: 'account',
        children: [
          {
            path: 'profile',
            component: DemoContentComponent,
          },
          {
            path: 'email',
            component: DemoContentComponent,
          },
          {
            path: 'password',
            component: DemoContentComponent,
          },
        ],
      },
    ],
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
