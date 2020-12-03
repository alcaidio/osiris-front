import { Section } from '../../models/section.model'
import { ID } from './../../../../shared/models/shared.model'

export class LoadSection {
  static readonly type = '[Diagnosis - Section] Load section'
  constructor(public payload: GeoJSON.Position) {}
}

export class LoadSectionWithId {
  static readonly type = '[Diagnosis - Section] Load section with Id'
  constructor(public payload: ID) {}
}

export class LoadSectionSuccess {
  static readonly type = '[Diagnosis - Section] Load section Success'
  constructor(public payload: Section) {}
}

export class LoadSectionFailure {
  static readonly type = '[Diagnosis - Section] Load section Failure'
  constructor(public payload: any) {}
}
