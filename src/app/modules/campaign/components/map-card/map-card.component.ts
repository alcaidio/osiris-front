import { Component } from '@angular/core'
import { Select } from '@ngxs/store'
import { Baselayer } from 'app/shared/models'
import { Observable } from 'rxjs'
import { Calque, Campaign } from '../../model/shared.model'
import { BaselayerState, CalqueState, CampaignsState } from '../../store'

@Component({
  selector: 'app-map-card',
  templateUrl: 'map-card.component.html',
  styleUrls: ['map-card.component.scss'],
})
export class MapCardComponent {
  @Select(CalqueState.entities) calques$: Observable<Calque[]>
  @Select(CampaignsState.active) campaign$: Observable<Campaign>
  @Select(BaselayerState.entities) baselayers$: Observable<Baselayer[]>
  @Select(BaselayerState.activeId) activeBaselayerId$: Observable<string>

  isToggled = true

  onToggled(): void {
    this.isToggled = !this.isToggled
  }

  onClick(type: string) {
    if (type === 'vue') {
      console.log('ACTION: POST enregistrer config par défaut')
    }
  }
}
