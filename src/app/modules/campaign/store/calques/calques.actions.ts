import { Calque, PropertyValue } from '../../model/shared.model'
import { CalqueProperty } from './../../model/shared.model'

export class GetCalques {
  static readonly type = '[calques] get'
  constructor(public calqueIds: string[]) {}
}

export class ToggleCalque {
  static readonly type = '[calques] toggle calque'
  constructor(public calque: Calque) {}
}

export class CheckCalque {
  static readonly type = '[calques] check calque'
  constructor(public calque: Calque) {}
}

export class ToggleProperty {
  static readonly type = '[calques] toggle property'
  constructor(public payload: { property: CalqueProperty; calque: Calque }) {}
}

export class CheckProperty {
  static readonly type = '[calques] check property'
  constructor(public payload: { property: CalqueProperty; calque: Calque }) {}
}

export class CheckValue {
  static readonly type = '[calques] check property value'
  constructor(public payload: { value: PropertyValue; property: CalqueProperty; calque: Calque }) {}
}
