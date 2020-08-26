import { ID } from './../../../../../shared/shared.model'
import { Section } from './../../models/section.model'

export class GetSection {
  static readonly type = '[Section] Get section'
  constructor(public payload: { lng: number; lat: number }) {}
}

export class GetSectionSuccess {
  static readonly type = '[Section] Get section Success'
  constructor(public payload: ID) {}
}

export class GetSectionFailure {
  static readonly type = '[Section] Get section Failure'
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
