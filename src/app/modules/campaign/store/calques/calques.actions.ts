import { Calque, PropertyValue } from '../../model/shared.model'
import { PropertyType } from './../../model/shared.model'

export class GetCalques {
  static readonly type = '[calques] get'
  constructor(public mapId: string) {}
}

export class ToggleCalque {
  static readonly type = '[calques] toggle calque'
  constructor(public calque: Calque) {}
}

export class CheckCalque {
  static readonly type = '[calques] check calque'
  constructor(public calque: Calque) {}
}

export class CheckCalqueTrue {
  static readonly type = '[calques] check calque true'
}

export class ToggleProperty {
  static readonly type = '[calques] toggle property'
  constructor(public payload: { property: PropertyType; calque: Calque }) {}
}

export class CheckProperty {
  static readonly type = '[calques] check property'
  constructor(public payload: { property: PropertyType; calque: Calque }) {}
}

export class CheckValue {
  static readonly type = '[calques] check property value'
  constructor(public payload: { value: PropertyValue; property: PropertyType; calque: Calque }) {}
}
