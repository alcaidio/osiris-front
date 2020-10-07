import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { catchError, map } from 'rxjs/operators'
import { DiagService } from '../../services/diag.service'
import {
  DeselectSection,
  GetSectionById,
  GetSectionByIdFailure,
  GetSectionByIdSuccess,
  GetSectionId,
  GetSectionIdFailure,
  GetSectionIdSuccess,
} from '../actions/section.action'
import { ID } from './../../../../../shared/shared.model'
import { Section, SectionIdDTO } from './../../models/section.model'
import { LayersState, LayersStateModel } from './layer.state'

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

  @Selector([LayersState])
  static getSectionColor(state: SectionsStateModel, layersState: LayersStateModel) {
    return layersState.entities[state.selectedSection.properties.layerIds.state].paint['line-color']
  }

  @Selector()
  static getSelectedId(state: SectionsStateModel) {
    return state.selectedSection.id
  }

  @Selector()
  static getSelectedSection(state: SectionsStateModel) {
    return state.selectedSection.id && state.entities[state.selectedSection.id]
  }

  @Action(GetSectionId)
  getSectionId({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSectionId) {
    patchState({
      loading: true,
    })
    return this.diagService.getSectionIdByLngLat(action.payload).pipe(
      map((res: SectionIdDTO) => dispatch(new GetSectionIdSuccess(res))),
      catchError((err) => dispatch(new GetSectionIdFailure(err)))
    )
  }

  @Action(GetSectionIdSuccess)
  getSectionSuccess({ dispatch, patchState }: StateContext<SectionsStateModel>, action: GetSectionIdSuccess) {
    const { distance, featureId, message } = action.payload
    patchState({
      loading: false,
    })
    if (featureId !== null) {
      dispatch(new Navigate(['/map/section/', featureId]))
    } else {
      this.notification.openSnackBar(`Aucune section trouvée dans un rayon de ${distance}m.`)
    }
  }

  @Action(GetSectionIdFailure)
  getSectionFailure({ patchState }: StateContext<SectionsStateModel>, action: GetSectionIdFailure) {
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

  @Action(DeselectSection)
  deselectSection({ patchState }: StateContext<SectionsStateModel>) {
    patchState({
      selectedSection: null,
    })
  }
}
