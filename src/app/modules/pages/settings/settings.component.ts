import { Component } from '@angular/core'
import { Select } from '@ngxs/store'
import { Language, Theme } from 'app/core/config/app.config'
import { ConfigState } from 'app/core/store'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-profile',
  template: `
    <div class="content-layout fullwidth-tabs-navigation-inner-scroll">
      <ng-container *transloco="let t; read: 'profile'">
        <div class="header">
          <div class="left">
            <h1>{{ 'settings.title' | transloco }}</h1>
          </div>
        </div>

        <div class="main">
          <!-- Navbar -->
          <nav mat-tab-nav-bar>
            <a
              mat-tab-link
              *ngFor="let link of navLinks"
              [routerLink]="link.path"
              routerLinkActive
              [active]="rla.isActive"
              #rla="routerLinkActive"
            >
              {{ link.title | transloco }}
            </a>
          </nav>

          <!-- Main inner -->
          <div class="main-inner">
            <router-outlet></router-outlet>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class SettingsComponent {
  @Select(ConfigState.getActiveTheme) theme$: Observable<Theme>
  @Select(ConfigState.getActiveLanguage) language$: Observable<Language>

  navLinks = [
    {
      path: 'profile',
      title: 'settings.tab.profile',
    },
    {
      path: 'contact',
      title: 'settings.tab.contact',
    },
    {
      path: 'preferences',
      title: 'settings.tab.preferences',
    },
  ]
}
