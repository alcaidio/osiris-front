import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ContactComponent, PreferencesComponent, ProfileComponent } from './containers'
import { FormsResolver } from './guards/settings.resolver'
import { SettingsComponent } from './settings.component'

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    resolve: {
      settings: FormsResolver,
    },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'preferences', component: PreferencesComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
