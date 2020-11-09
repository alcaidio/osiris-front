import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { BaseMapState } from './base-map/base-map.state'
import { PicturesState } from './pictures/pictures.state'
import { UiState } from './ui/ui.state'

@State({
  name: 'imajebox',
  children: [BaseMapState, PicturesState, UiState],
})
@Injectable()
export class ImajboxState {}
