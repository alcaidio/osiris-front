import { BaseMapState } from './base-map/base-map.state'
import { DiagnosisState } from './diagnosis.state'
import { SectionState } from './section/section.state'
import { UIState } from './ui/ui.state'

export const DiagnosisStates = [DiagnosisState, BaseMapState, UIState, SectionState]

export * from './base-map/base-map.action'
export * from './base-map/base-map.state'
export * from './section/section.action'
export * from './section/section.state'
export * from './ui/ui.action'
export * from './ui/ui.state'
