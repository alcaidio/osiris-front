import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { TreoNavigationModule } from '@treo/components/navigation'
import { DemoContentComponent } from './components/demo-content/demo-content.component'
import { SidebarContentComponent } from './components/sidebar.component'
import { SettingsComponent } from './containers/settings.component'
import { SettingsRoutingModule } from './settings.routing'

const MATERIAL = [MatIconModule, MatProgressBarModule, MatButtonModule, MatMenuModule, MatSidenavModule]

@NgModule({
  declarations: [DemoContentComponent, SidebarContentComponent, SettingsComponent],
  imports: [CommonModule, SettingsRoutingModule, TreoNavigationModule, ...MATERIAL],
})
export class SettingsModule {}
