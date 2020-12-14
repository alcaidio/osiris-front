import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngxs/store'
import { Language, Theme } from 'app/core/config/app.config'
import { ChangeLanguage, ChangeTheme } from 'app/core/store'
import { SelectItem, UserPreferences } from './../models/settings.model'

@Component({
  selector: 'app-preferences',
  template: `
    <app-form
      [formGroup]="preferencesForm"
      [title]="title"
      [subtitle]="subtitle"
      [data]="data"
      (resetForm)="onReset()"
      (submitForm)="onSubmit($event)"
    >
      <div class="flex-auto min-w-64">
        <div class="flex">
          <mat-form-field class="flex-auto">
            <mat-label>{{ 'settings.preferences.language' | transloco }}</mat-label>
            <mat-select formControlName="language">
              <mat-option *ngFor="let language of languages" [value]="language.value">{{
                language.label | transloco
              }}</mat-option>
            </mat-select>
            <mat-icon matPrefix [svgIcon]="'language'"></mat-icon>
          </mat-form-field>
        </div>
        <div class="flex">
          <mat-form-field class="flex-auto">
            <mat-label>{{ 'settings.preferences.language' | transloco }}</mat-label>
            <mat-select formControlName="theme">
              <mat-option *ngFor="let theme of themes" [value]="theme.value">{{ theme.label | transloco }}</mat-option>
            </mat-select>
            <mat-icon matPrefix [svgIcon]="'brightness_medium'"></mat-icon>
          </mat-form-field>
        </div>
      </div>
    </app-form>
  `,
})
export class PreferencesComponent implements OnInit {
  title = 'settings.preferences.title'
  subtitle = 'settings.preferences.subtitle'
  preferencesForm: FormGroup
  data: UserPreferences
  languages: SelectItem<Language>[]
  themes: SelectItem<Theme>[]

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.languages = [
      { label: 'settings.language.fr', value: 'fr' },
      { label: 'settings.language.en', value: 'en' },
    ]

    this.themes = [
      { label: 'settings.theme.light', value: 'light' },
      { label: 'settings.theme.dark', value: 'dark' },
    ]

    this.preferencesForm = this.fb.group({
      language: ['', Validators.required],
      theme: ['', Validators.required],
    })

    this.initForm()
  }

  private initForm(): void {
    const { language, theme } = this.route.parent.snapshot.data['settings']
    this.data = { language, theme } as UserPreferences
    this.preferencesForm.patchValue(this.data)
  }

  onReset(): void {
    this.initForm()
  }

  onSubmit(values: UserPreferences): void {
    const { language, theme } = values
    // ==> service.patchUserSetting
    // load during send, add loader in button, and after send dispatch actions below
    if (language !== this.data.language) {
      this.store.dispatch(new ChangeLanguage(language))
    }
    if (theme !== this.data.theme) {
      this.store.dispatch(new ChangeTheme(theme))
    }
    this.data = values
  }
}
