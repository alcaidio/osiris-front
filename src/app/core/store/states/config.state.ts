import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { getBrowserLang, TranslocoService } from '@ngneat/transloco'
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store'
import { Language } from 'app/core/config/app.config'
import { LayoutTheme, Theme } from '../../../shared/models/core.model'
import { ChangeLanguage, ChangeNavigationLoad, ChangeTheme } from '../actions/config.actions'

export interface ConfigStateModel {
  language: Language
  theme: Theme
  layout?: LayoutTheme
  navigationLoad: boolean
}

@State<ConfigStateModel>({
  name: 'config',
  defaults: {
    language: 'fr',
    theme: 'light',
    layout: 'compact',
    navigationLoad: true, // use when data load into resolvers
  },
})
@Injectable()
export class ConfigState implements NgxsOnInit {
  @Selector()
  static getActiveLanguage(state: ConfigStateModel): Language {
    return state.language
  }

  @Selector()
  static getActiveTheme(state: ConfigStateModel): Theme {
    return state.theme
  }

  @Selector()
  static getActiveLayoutTheme(state: ConfigStateModel): LayoutTheme {
    return state.layout
  }

  @Selector()
  static getNavigationLoad(state: ConfigStateModel): boolean {
    return state.navigationLoad
  }

  constructor(@Inject(DOCUMENT) private document: any, private translocoService: TranslocoService) {}

  ngxsOnInit({ patchState }: StateContext<ConfigStateModel>) {
    // TODO: get language in the bdd settings by user
    const languages = this.translocoService.getAvailableLangs()
    const browserLang = getBrowserLang()
    if (languages.includes(browserLang as any)) {
      this.translocoService.setActiveLang(browserLang)
      patchState({
        language: browserLang as Language,
      })
    } else {
      this.translocoService.setActiveLang('en')
      patchState({
        language: 'en' as Language,
      })
    }
  }

  @Action(ChangeTheme)
  changeTheme({ patchState }: StateContext<ConfigStateModel>, action: ChangeTheme) {
    this.updateTheme(action.payload)
    patchState({
      theme: action.payload,
    })
  }

  @Action(ChangeLanguage)
  changeLanguage({ patchState }: StateContext<ConfigStateModel>, action: ChangeLanguage) {
    this.translocoService.setActiveLang(action.payload)
    if (action.payload === this.translocoService.getActiveLang()) {
      patchState({
        language: action.payload,
      })
    } else {
      console.warn('Language problem')
    }
  }

  @Action(ChangeNavigationLoad)
  changeNavigationLoad({ patchState }: StateContext<ConfigStateModel>, action: ChangeNavigationLoad) {
    patchState({
      navigationLoad: action.payload,
    })
  }

  private updateTheme(theme: Theme): void {
    this.document.body.classList.forEach((className: string) => {
      if (className.startsWith('treo-theme-')) {
        this.document.body.classList.remove(className)
      }
    })
    this.document.body.classList.add('treo-theme-' + theme)
  }
}
