import { Component, Input } from '@angular/core'
import { Store } from '@ngxs/store'
import { Overlay } from '../../model/shared.model'
import { ToggleOverlay } from '../../store'

@Component({
  selector: 'app-overlay-list',
  templateUrl: './overlay-list.component.html',
  styleUrls: ['./overlay-list.component.scss'],
})
export class OverlayListComponent {
  @Input() overlays: Overlay[]

  constructor(private store: Store) {}

  onToggleOverlay(id: string, visible: boolean): void {
    this.store.dispatch(new ToggleOverlay({ id, visible }))
  }
}
