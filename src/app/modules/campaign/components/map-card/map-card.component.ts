import { Component, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { BaseLayer, Calque, Campaign } from '../../model/campaign.model'
import { BaselayerState, CalqueState, CampaignsState, ToggleMapCard, UIState } from '../../store'
import { OsirisAnimations } from '../../utils/animation.utils'

type actionType = 'vue' | 'newCalque' | 'stats'

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
  @Select(BaselayerState.entities) baselayers$: Observable<BaseLayer[]>
  @Select(BaselayerState.activeId) activeBaselayerId$: Observable<string>
  @Select(UIState.getIsMapCard) isOpen$: Observable<boolean>

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  onToggled(): void {
    this.store.dispatch(new ToggleMapCard())
  }

  onClick(type: actionType) {
    switch (type) {
      case 'stats':
        this.router.navigate(['stats'], { relativeTo: this.route })
        break
      default:
        console.warn('Action: no action available for this')
    }
  }

  ngOnDestroy(): void {
    // Don't remove !
    // here because of AutoUnsubscrive() above the component decorator.
  }
}
