import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { LayersState } from './layer.state'
import { SectionsState } from './section.state'

@State({
  name: 'map',
  children: [LayersState, SectionsState],
})
@Injectable()
export class MapState {}
