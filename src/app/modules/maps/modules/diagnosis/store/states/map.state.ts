import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { BaseMapState } from './base-map.state'
import { LayersState } from './layer.state'
import { SectionsState } from './section.state'
import { UIState } from './ui.state'

@State({
  name: 'map',
  children: [LayersState, SectionsState, UIState, BaseMapState],
})
@Injectable()
export class MapState {}
