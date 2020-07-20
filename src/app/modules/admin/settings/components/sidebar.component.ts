import { Component, ViewEncapsulation } from '@angular/core'
import { TreoNavigationItem } from '../../../../../@treo/components/navigation/navigation.types'

@Component({
  selector: 'sidebar-settings',
  template: `
    <!-- Fixed demo sidebar -->
    <h3 class="mx-6 my-0">Settings</h3>
    <treo-vertical-navigation
      [opened]="true"
      [navigation]="menuData"
      [inner]="false"
      [mode]="'side'"
      [name]="'demo-sidebar-navigation'"
    ></treo-vertical-navigation>
  `,
  styleUrls: ['sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarContentComponent {
  menuData: TreoNavigationItem[]

  constructor() {
    // Set the defaults
    this.menuData = [
      {
        title: 'Workspace',
        type: 'group',
        children: [
          {
            title: 'General Settings',
            type: 'basic',
            link: 'workspace',
            icon: 'settings',
          },
          {
            title: 'User directory',
            type: 'basic',
            link: 'users',
            icon: 'group',
          },
          {
            title: 'Billing',
            type: 'basic',
            link: 'billing',
            icon: 'monetization_on',
          },
        ],
      },
      {
        title: 'Account',
        type: 'group',
        children: [
          {
            title: 'Your profile',
            type: 'basic',
            link: 'account/profile',
            icon: 'account_circle',
          },
          {
            title: 'Email Addresses',
            type: 'basic',
            link: 'account/email',
            icon: 'email',
          },
          {
            title: 'Password',
            type: 'basic',
            link: 'account/password',
            icon: 'security',
          },
        ],
      },
    ]
  }
}
