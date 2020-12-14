import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ID } from '../../../../shared/models/shared.model'
import { DiagService } from '../../services/diag.service'
import { BaseMapState } from '../base-map/base-map.state'
import { OpenDrawer } from '../ui/ui.action'
import { Overlay } from './../../../../shared/models/maps.model'
import { Section, SectionIdDTO } from './../../models/section.model'
import { LoadSection, LoadSectionFailure, LoadSectionSuccess, LoadSectionWithId } from './section.action'

export interface SectionStateModel {
  ids: ID[]
  entities: {
    [id: string]: Section
  }
  selectedSectionId: ID | null
  loading: boolean
  error: string | null
}

export const sectionStateDefaults: SectionStateModel = {
  ids: [],
  entities: {},
  selectedSectionId: null,
  loading: false,
  error: null,
}

@State<SectionStateModel>({
  name: 'diagnosisSection',
  defaults: sectionStateDefaults,
})
@Injectable()
export class SectionState {
  constructor(private diagService: DiagService, private notification: NotificationService) {}

  @Selector()
  static getSelectedSection(state: SectionStateModel): Section {
    return state.selectedSectionId && state.entities[state.selectedSectionId]
  }

  @Selector([BaseMapState.getOverlays])
  static getSectionColor(state: SectionStateModel, overlays: Overlay[]) {
    return overlays.find((overlay) => overlay.id === SectionState.getSelectedSection(state).properties.layerIds.state)
      .paint['line-color']
  }

  @Action(LoadSection)
  load({ dispatch, patchState }: StateContext<SectionStateModel>, action: LoadSection) {
    patchState({
      loading: true,
    })

    return this.diagService.getSectionIdByLngLat(action.payload).pipe(
      map((selected: SectionIdDTO) => {
        dispatch(new Navigate(['/diagnosis/section/', selected.featureId]))
      }),
      catchError((err) => {
        dispatch(new LoadSectionFailure(err))
        return of(err)
      })
    )
  }

  @Action(LoadSectionWithId)
  loadById({ dispatch, patchState, getState }: StateContext<SectionStateModel>, action: LoadSectionWithId) {
    patchState({
      loading: true,
    })

    const section = getState().entities[action.payload]

    if (section) {
      return dispatch(new LoadSectionSuccess(section))
    } else {
      return this.diagService.getSectionById(action.payload).pipe(
        map((s: Section) => dispatch(new LoadSectionSuccess(s))),
        catchError((err) => {
          dispatch(new LoadSectionFailure(err))
          return of(err)
        })
      )
    }
  }

  @Action(LoadSectionSuccess)
  loadSuccess({ patchState, getState, dispatch }: StateContext<SectionStateModel>, action: LoadSectionSuccess) {
    const state = getState()
    const id = action.payload.id
    patchState({
      ids: state.ids.indexOf(id) === -1 ? [...state.ids, id] : [...state.ids],
      entities: { ...state.entities, [id]: action.payload },
      selectedSectionId: id,
      loading: false,
    })
    if (id !== null) {
      dispatch(new OpenDrawer())
    } else {
      this.notification.openSnackBar(`Aucune section trouvée, veuillez réésayer.`, 'ok')
    }
  }

  @Action(LoadSectionFailure)
  loadFailure({ patchState }: StateContext<SectionStateModel>, action: LoadSectionFailure) {
    patchState({
      error: action.payload,
      loading: false,
    })
    this.notification.openSnackBar(`Aucune section trouvée, veuillez réésayer.`, 'ok')
  }
}
