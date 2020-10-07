import { ID } from './../../../../../shared/shared.model'
import { Section, SectionIdDTO } from './../../models/section.model'

export class GetSectionId {
  static readonly type = '[Section] Get section id'
  constructor(public payload: { lng: number; lat: number }) {}
}

export class GetSectionIdSuccess {
  static readonly type = '[Section] Get section id Success'
  constructor(public payload: SectionIdDTO) {}
}

export class GetSectionIdFailure {
  static readonly type = '[Section] Get section id Failure'
  constructor(public payload: any) {}
}

export class GetSectionById {
  static readonly type = '[Section] Get Section by Id'
  constructor(public payload: ID) {}
}

export class GetSectionByIdSuccess {
  static readonly type = '[Section] Get Section by Id Success'
  constructor(public payload: Section) {}
}

export class GetSectionByIdFailure {
  static readonly type = '[Section] Get Section by Id Failure'
  constructor(public payload: any) {}
}

export class DeselectSection {
  static readonly type = '[Section] Deselect section'
}
