import { Component, EventEmitter, OnDestroy, Output } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Baselayer } from 'app/shared/models'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { Calque, Campaign } from '../../model/shared.model'
import { BaselayerState, CalqueState, CampaignsState, ToggleMapCard, UIState } from '../../store'
import { OsirisAnimations } from '../../utils/animation.utils'

type actionType = 'vue' | 'newCalque'

@AutoUnsubscribe()
@Component({
  selector: 'app-map-card',
  templateUrl: 'map-card.component.html',
  styleUrls: ['map-card.component.scss'],
  animations: OsirisAnimations,
})
export class MapCardComponent implements OnDestroy {
  // normally the component has no direct data via the store. Thereafter the data must only pass through the inputs
  @Select(CalqueState.entities) calques$: Observable<Calque[]>
  @Select(CalqueState.loading) calqueLoading$: Observable<boolean>
  @Select(CampaignsState.active) campaign$: Observable<Campaign>
  @Select(BaselayerState.entities) baselayers$: Observable<Baselayer[]>
  @Select(BaselayerState.activeId) activeBaselayerId$: Observable<string>
  @Select(UIState.getIsMapCard) isOpen$: Observable<boolean>
  @Output() action = new EventEmitter<string>()

  constructor(private store: Store) {}

  onToggled(): void {
    this.store.dispatch(new ToggleMapCard())
  }

  onClick(type: actionType) {
    this.action.emit(type)
  }

  ngOnDestroy(): void {
    // Don't remove !
    // here because of AutoUnsubscrive() above the component decorator.
  }
}
