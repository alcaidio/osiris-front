import { Component, Input } from '@angular/core'
import { MatSelectChange } from '@angular/material/select'
import { SetActive, UpdateActive } from '@ngxs-labs/entity-state'
import { Store } from '@ngxs/store'
import { BaseLayer } from '../../model/shared.model'
import { BaselayerState, MapState } from '../../store'

@Component({
  selector: 'app-baselayer-list',
  templateUrl: './baselayer-list.component.html',
  styleUrls: ['./baselayer-list.component.scss'],
})
export class BaselayerListComponent {
  @Input() baselayers: BaseLayer[]
  @Input() activeBaselayerId: string

  constructor(private store: Store) {}

  onBaselayerChange(evt: MatSelectChange) {
    const baselayerId = evt.value
    this.store.dispatch(new SetActive(BaselayerState, baselayerId as string))
    const baselayer = this.store.selectSnapshot(BaselayerState.active)
    const config = this.store.selectSnapshot(MapState.active).config
    const newConfig = { ...config, layers: baselayer }
    this.store.dispatch(new UpdateActive(MapState, { config: newConfig }))
  }
}
