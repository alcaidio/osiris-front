import { Language, Theme } from 'app/core/config/app.config'

export interface SelectItem<T> {
  label: string
  value: T
}

export interface ProfileForm {
  avatar: string | null
  firstName: string | null
  lastName: string | null
  job: string | null
  bio: string | null
}

export interface ContactForm {
  email: string
  phone: string | null
}

export interface PreferencesForm {
  language: SelectItem<Language>
  theme: SelectItem<Theme>
}

export interface UserInfo extends ProfileForm, ContactForm {}

export interface UserPreferences {
  language: Language
  theme: Theme
}

export interface UserSettings extends UserInfo, UserPreferences {}
