import { Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { ChangeLanguage, ChangeTheme } from 'app/core/store'
import { Observable } from 'rxjs'
import { Language, Theme } from '../models'
import { ConfigState } from './../../core/store/states/config.state'

@Component({
  selector: 'app-settings-dialog',
  template: `
    <div class="px-12 py-8">
      <ng-container *transloco="let t; read: 'settings'">
        <h1 mat-dialog-title class="text-3xl">⚙️ {{ t('title') }}</h1>
        <div mat-dialog-content class="py-3">
          <div class="mb-6" *ngIf="theme$ | async as activeTheme">
            <div class="font-semibold mb-3 text-xl">{{ t('theme.title') }}</div>
            <mat-radio-group aria-label="Select a theme" class="flex ml-3">
              <mat-radio-button
                class="flex-auto"
                *ngFor="let theme of themes"
                [value]="theme.value"
                [checked]="theme.value === activeTheme"
                color="primary"
                (change)="onChangeTheme($event.value)"
                >{{ t(theme.label) }}</mat-radio-button
              >
            </mat-radio-group>
          </div>

          <div class="mb-6" *ngIf="language$ | async as l">
            <div class="font-semibold mb-3 text-xl">{{ t('language.title') }}</div>
            <mat-radio-group aria-label="Select a language" class="flex ml-3">
              <mat-radio-button
                class="flex-auto"
                *ngFor="let language of languages"
                [value]="language.value"
                [checked]="language.value === l"
                color="primary"
                (change)="onChangeLanguage($event.value)"
              >
                {{ t(language.label) }}
              </mat-radio-button>
            </mat-radio-group>
          </div>
        </div>

        <div mat-dialog-actions [align]="'end'">
          <button mat-flat-button color="accent" mat-dialog-close>{{ t('button') }}</button>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .mat-radio-button ~ .mat-radio-button {
        margin-left: 16px;
      }
    `,
  ],
})
export class SettingsDialogComponent {
  @Select(ConfigState.getActiveTheme) theme$: Observable<Theme>
  @Select(ConfigState.getActiveLanguage) language$: Observable<Language>

  languages = [
    { label: 'language.fr', value: 'fr' },
    { label: 'language.en', value: 'en' },
  ]
  themes = [
    { label: 'theme.light', value: 'light' },
    { label: 'theme.dark', value: 'dark' },
  ]

  constructor(private store: Store) {}

  onChangeLanguage(evt: Language) {
    if (evt) {
      this.store.dispatch(new ChangeLanguage(evt))
    }
  }

  onChangeTheme(evt: Theme) {
    if (evt) {
      this.store.dispatch(new ChangeTheme(evt))
    }
  }
}
