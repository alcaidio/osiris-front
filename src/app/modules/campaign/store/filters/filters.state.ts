import { Injectable } from '@angular/core'
import { CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy } from '@ngxs-labs/entity-state'
import { Action, State, StateContext } from '@ngxs/store'
import { FiltersProp } from '../../model/shared.model'
import { createFilters } from '../../utils'
import { CreateFilters } from './filters.actions'

@State<EntityStateModel<FiltersProp>>({
  name: 'filters',
  defaults: defaultEntityState(),
})
@Injectable()
export class FilterState extends EntityState<FiltersProp> {
  constructor() {
    super(FilterState, 'calqueId', IdStrategy.EntityIdGenerator)
  }

  @Action(CreateFilters)
  createFilters(ctx: StateContext<FilterState>, action: CreateFilters) {
    const filters = createFilters(action.calque.properties)
    console.log(filters)
    ctx.dispatch(new CreateOrReplace(FilterState, { calqueId: action.calque.id, filters }))
  }
}
