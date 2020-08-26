import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { catchError, map } from 'rxjs/operators'
import { DiagService } from '../../services/diag.service'
import {
  GetSection,
  GetSectionById,
  GetSectionByIdFailure,
  GetSectionByIdSuccess,
  GetSectionFailure,
  GetSectionSuccess,
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
  selectedSection: Section | null
}

export const SectionsStateDefaults: SectionsStateModel = {
  ids: [],
  entities: {},
  loading: false,
  error: null,
  selectedSection: null,
}

@State<SectionsStateModel>({
  name: 'sections',
  defaults: SectionsStateDefaults,
})
@Injectable()
export class SectionsState {
  constructor(private diagService: DiagService, private notification: NotificationService) {}

  @Selector()
  static getEntities(state: SectionsStateModel) {
    return state.entities
  }

  @Selector()
  static getSelectedId(state: SectionsStateModel) {
    return state.selectedSection.id
  }

  @Selector()
  static getSelectedSection(state: SectionsStateModel) {
    return state.selectedSection.id && state.entities[state.selectedSection.id]
  }

  @Action(GetSection)
  getSection({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSection) {
    patchState({
      loading: true,
    })
    return this.diagService.getSectionIdByLngLat(action.payload).pipe(
      map((id: ID) => dispatch(new GetSectionSuccess(id))),
      catchError((err) => dispatch(new GetSectionFailure(err)))
    )
  }

  @Action(GetSectionSuccess)
  getSectionSuccess({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSectionSuccess) {
    const id = action.payload
    patchState({
      loading: false,
    })
    dispatch(new Navigate(['/map/section/', id]))
  }

  @Action(GetSectionFailure)
  getSectionFailure({ patchState }: StateContext<SectionsStateModel>, action: GetSectionFailure) {
    patchState({
      error: action.payload,
      loading: false,
    })
    // TODO mettre message retourné par le back
    this.notification.openSnackBar('Aucune section dans un rayon de 50m.')
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
      selectedSection: section,
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
