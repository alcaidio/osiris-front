import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { catchError, map } from 'rxjs/operators'
import { CustomMapComponent } from '../../containers/map.component'
import { DiagService } from '../../services/diag.service'
import {
  GetSectionById,
  GetSectionByIdFailure,
  GetSectionByIdSuccess,
  GetSectionId,
  GetSectionIdFailure,
  GetSectionIdSuccess,
} from '../actions/section.action'
import { ID } from './../../../../../shared/shared.model'
import { Section } from './../../models/section.model'

export interface SectionsStateModel {
  ids: ID[]
  entities: {
    [id: string]: Section
  }
  loading: boolean
  error: string | null
  selectedSectionId: ID | null
}

export const SectionsStateDefaults: SectionsStateModel = {
  ids: [],
  entities: {},
  loading: false,
  error: null,
  selectedSectionId: null,
}

@State<SectionsStateModel>({
  name: 'sections',
  defaults: SectionsStateDefaults,
})
@Injectable()
export class SectionsState {
  constructor(private diagService: DiagService, private mapComponent: CustomMapComponent) {}

  @Selector()
  static getEntities(state: SectionsStateModel) {
    return state.entities
  }

  @Selector()
  static getSelectedId(state: SectionsStateModel) {
    return state.selectedSectionId
  }

  @Selector()
  static getSelectedSection(state: SectionsStateModel) {
    return state.selectedSectionId && state.entities[state.selectedSectionId]
  }

  @Action(GetSectionId)
  getSectionId({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSectionId) {
    patchState({
      loading: true,
    })
    return this.diagService.getSectionIdByLngLat(action.payload).pipe(
      map((id: ID) => dispatch(new GetSectionIdSuccess(id))),
      catchError((err) => dispatch(new GetSectionIdFailure(err.error.error.message)))
    )
  }

  @Action(GetSectionIdSuccess)
  getSectionIdSuccess({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSectionIdSuccess) {
    const id = action.payload
    patchState({
      loading: false,
      selectedSectionId: id,
    })
    dispatch(new Navigate(['/map/sections', id]))
  }

  @Action(GetSectionIdFailure)
  getSectionIdFailure({ patchState }: StateContext<SectionsStateModel>, action: GetSectionIdFailure) {
    patchState({
      error: action.payload,
      loading: false,
    })
  }

  @Action(GetSectionById)
  getSectionById({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSectionById) {
    patchState({
      loading: true,
    })
    return this.diagService.getSectionById(action.payload).pipe(
      map((section: Section) => dispatch(new GetSectionByIdSuccess(section))),
      catchError((err) => dispatch(new GetSectionByIdFailure(err)))
    )
  }

  @Action(GetSectionByIdSuccess)
  getSectionByIdSuccess(ctx: StateContext<SectionsStateModel>, action: GetSectionByIdSuccess) {
    const section = action.payload
    const state = ctx.getState()
    ctx.patchState({
      ids: [...state.ids, section.id],
      entities: { ...state.entities, [section.id]: section },
      loading: false,
      selectedSectionId: section.id,
    })
  }

  @Action(GetSectionByIdFailure)
  getSectionByIdFailure({ patchState }: StateContext<SectionsStateModel>, action: GetSectionByIdFailure) {
    patchState({
      error: action.payload,
      loading: false,
    })
  }
}
