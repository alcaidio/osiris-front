import { Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Baselayer } from 'app/shared/models'
import { Observable } from 'rxjs'
import { Calque, Campaign } from '../../model/shared.model'
import { BaselayerState, CalqueState, CampaignsState, ToggleMapCard, UIState } from '../../store'
import { OsirisAnimations } from '../../utils/animation.utils'

@Component({
  selector: 'app-map-card',
  templateUrl: 'map-card.component.html',
  styleUrls: ['map-card.component.scss'],
  animations: OsirisAnimations,
})
export class MapCardComponent {
  @Select(CalqueState.entities) calques$: Observable<Calque[]>
  @Select(CampaignsState.active) campaign$: Observable<Campaign>
  @Select(BaselayerState.entities) baselayers$: Observable<Baselayer[]>
  @Select(BaselayerState.activeId) activeBaselayerId$: Observable<string>
  @Select(UIState.getIsMapCard) isOpen$: Observable<boolean>

  constructor(private store: Store) {}

  onToggled(): void {
    this.store.dispatch(new ToggleMapCard())
  }

  onClick(type: string) {
    if (type === 'vue') {
      console.log('ACTION: POST enregistrer config par défaut')
    }
  }
}
