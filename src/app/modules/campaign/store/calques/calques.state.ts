import { Injectable } from '@angular/core'
import {
  Add,
  defaultEntityState,
  EntityState,
  EntityStateModel,
  IdStrategy,
  SetError,
  SetLoading,
  Update,
} from '@ngxs-labs/entity-state'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Calque } from '../../model/shared.model'
import { ApiService } from '../../services/api.service'
import { CheckCalque, CheckProperty, CheckValue, GetCalques, ToggleCalque, ToggleProperty } from './calques.actions'

const checkTheCheckboxState = (arr: Array<any>) => {
  if (arr.every((e) => e.checked === true)) {
    // Checked
    return { indeterminate: false, checked: true }
  } else if (arr.every((e) => e.checked === false)) {
    // Unchecked
    return { indeterminate: false, checked: false }
  } else {
    // Indeterminate
    return { indeterminate: true, checked: true }
  }
}

// TODO : refactor checkbox actions because redondant code
// FIX : indeterminate animation doesn't work (not important)
// _______________________________________________________

@State<EntityStateModel<Calque>>({
  name: 'calques',
  defaults: defaultEntityState(),
})
@Injectable()
export class CalqueState extends EntityState<Calque> {
  constructor(private api: ApiService) {
    super(CalqueState, 'id', IdStrategy.EntityIdGenerator)
  }

  @Selector()
  static getEntities(state: EntityStateModel<Calque>) {
    return state.entities
  }

  @Action(GetCalques)
  getCalques(ctx: StateContext<CalqueState>, action: GetCalques) {
    ctx.dispatch(new SetLoading(CalqueState, true))

    return this.api.getCalques(action.calqueIds).pipe(
      map((calques: Calque[]) => {
        const state = ctx.getState()
        if (state['ids'] && state['ids'].length > 0) {
          const newCalques = calques.filter((item) => state['ids'].includes(item))
          if (newCalques.length > 0) {
            ctx.dispatch(new Add(CalqueState, calques))
          }
        } else {
          ctx.dispatch(new Add(CalqueState, calques))
        }

        // REMOVE: Simulation latence
        setTimeout(() => {
          ctx.dispatch(new SetLoading(CalqueState, false))
        }, 200)
      }),
      catchError((err) => {
        ctx.dispatch(new SetError(CalqueState, err))
        ctx.dispatch(new SetLoading(CalqueState, false))
        return of(err)
      })
    )
  }

  @Action(ToggleCalque)
  toggleCalque(ctx: StateContext<EntityStateModel<Calque>>, action: ToggleCalque) {
    ctx.dispatch(
      new Update(
        CalqueState,
        (e) => e.id === action.calque.id,
        (e) => {
          return { ...e, toggled: !e.toggled }
        }
      )
    )
  }

  @Action(CheckCalque)
  checkCalque(ctx: StateContext<EntityStateModel<Calque>>, action: CheckCalque) {
    // update the state of all child's calque (properties and values)
    const newProperties = action.calque.properties.map((p) => {
      // values
      const newValues = p.values.map((v) => {
        if (action.calque.checked) {
          return { ...v, checked: false }
        } else {
          return { ...v, checked: true }
        }
      })

      // properties
      if (action.calque.checked) {
        return { ...p, checked: false, indeterminate: false, values: newValues }
      } else {
        return { ...p, checked: true, indeterminate: false, values: newValues }
      }
    })

    ctx.dispatch(
      new Update(
        CalqueState,
        (e) => e.id === action.calque.id,
        (e) => {
          return { ...e, checked: !e.checked, indeterminate: false, properties: newProperties }
        }
      )
    )
  }

  @Action(ToggleProperty)
  toggleProperty(ctx: StateContext<EntityStateModel<Calque>>, action: ToggleProperty) {
    const newProperty = { ...action.payload.property, toggled: !action.payload.property.toggled }
    const propertieFiltered = action.payload.calque.properties.filter((p) => p.id !== action.payload.property.id)
    const newProperties = [...propertieFiltered, newProperty]

    ctx.dispatch(
      new Update(
        CalqueState,
        (e) => e.id === action.payload.calque.id,
        (e) => {
          return { ...e, properties: newProperties }
        }
      )
    )
  }

  @Action(CheckProperty)
  checkProperty(ctx: StateContext<EntityStateModel<Calque>>, action: CheckProperty) {
    // update the state of all child's property (values)
    const newValues = action.payload.property.values.map((v) => {
      if (action.payload.property.checked) {
        return { ...v, checked: false }
      } else {
        return { ...v, checked: true }
      }
    })

    // check the state of all values to adapt property state
    const checkboxValuesState = checkTheCheckboxState(newValues)
    const newProperty = { ...action.payload.property, ...checkboxValuesState, values: newValues }

    // construct the new array of properties
    const propertieFiltered = action.payload.calque.properties.filter((p) => p.id !== action.payload.property.id)
    const newProperties = [...propertieFiltered, newProperty]

    // check the state of all properties to adapt calque state and update the calque entity
    const checkboxPropertiesState = checkTheCheckboxState(newProperties)

    ctx.dispatch(
      new Update(
        CalqueState,
        (e) => e.id === action.payload.calque.id,
        (e) => {
          return { ...e, ...checkboxPropertiesState, properties: newProperties }
        }
      )
    )
  }

  @Action(CheckValue)
  checkValue(ctx: StateContext<EntityStateModel<Calque>>, action: CheckValue) {
    // update the state of checked value
    const valueFiltered = action.payload.property.values.filter((v) => v.id !== action.payload.value.id)
    const newValues = [...valueFiltered, { ...action.payload.value, checked: !action.payload.value.checked }]

    // check the state of all values to adapt property state
    const checkboxValuesState = checkTheCheckboxState(newValues)
    const newProperty = { ...action.payload.property, ...checkboxValuesState, values: newValues }

    // construct the new array of properties
    const propertieFiltered = action.payload.calque.properties.filter((p) => p.id !== action.payload.property.id)
    const newProperties = [...propertieFiltered, newProperty]

    // check the state of all properties to adapt calque state and update the calque entity
    const checkboxPropertiesState = checkTheCheckboxState(newValues)

    ctx.dispatch(
      new Update(
        CalqueState,
        (e) => e.id === action.payload.calque.id,
        (e) => {
          return { ...e, ...checkboxPropertiesState, properties: newProperties }
        }
      )
    )
  }
}
