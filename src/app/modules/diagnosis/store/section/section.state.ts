import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ID } from '../../../../shared/models/shared.model'
import { DiagService } from '../../services/diag.service'
import { Section } from './../../models/section.model'
import { LoadSection, LoadSectionFailure, LoadSectionSuccess } from './section.action'

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

  @Action(LoadSection)
  load({ dispatch, patchState }: StateContext<SectionStateModel>, action: LoadSection) {
    patchState({
      loading: true,
    })
    return this.diagService.getSection(action.payload).pipe(
      map((section: Section) => dispatch(new LoadSectionSuccess(section))),
      catchError((err) => {
        dispatch(new LoadSectionFailure(err))
        return of(err)
      })
    )
  }

  @Action(LoadSectionSuccess)
  loadSuccess({ patchState, getState, dispatch }: StateContext<SectionStateModel>, action: LoadSectionSuccess) {
    const state = getState()
    const id = action.payload.id
    patchState({
      ids: [...state.ids, id],
      entities: { ...state.entities, [id]: action.payload },
      selectedSectionId: id,
      loading: false,
    })
    if (id !== null) {
      dispatch(new Navigate(['/diagnosis/section/', id]))
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
