import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { BaseMapState } from './base-map/base-map.state'
import { SectionState } from './section/section.state'
import { UIState } from './ui/ui.state'

@State({
  name: 'diagnosis',
  children: [BaseMapState, UIState, SectionState],
})
@Injectable()
export class DiagnosisState {}
