import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'app/shared/shared.module'
import { FormComponent } from './components/form.component'
import { ContactComponent, PreferencesComponent, ProfileComponent } from './containers'
import { FormsResolver } from './guards/settings.resolver'
import { SettingsService } from './services/settings.service'
import { SettingsComponent } from './settings.component'
import { SettingsRoutingModule } from './settings.routing'

@NgModule({
  declarations: [SettingsComponent, FormComponent, ProfileComponent, ContactComponent, PreferencesComponent],
  imports: [CommonModule, SettingsRoutingModule, HttpClientModule, SharedModule, ReactiveFormsModule],
  providers: [SettingsService, FormsResolver],
})
export class SettingsModule {}
