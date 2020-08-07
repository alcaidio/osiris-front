import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Layer } from '../models/layer.model'

@Component({
  selector: 'app-layer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngFor="let layer of layers; trackBy: trackByFn">
      <mgl-layer *ngIf="layer.visible" [id]="layer.id" [type]="layer.type" [source]="layer.source"></mgl-layer>
    </ng-container>
  `,
})
export class LayerComponent {
  @Input() layers: Layer[]

  trackByFn(index: number, item: any): string {
    return item.id || index
  }
}
