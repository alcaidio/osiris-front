import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { Layout } from './../../../layout/layout.types'

export type Theme = 'auto' | 'dark' | 'light'

export interface ConfigStateModel {
  layout: Layout
  theme: Theme
}

@State<ConfigStateModel>({
  name: 'config',
  defaults: {
    layout: 'compact',
    theme: 'light',
  },
})
@Injectable()
export class ConfigState {}
