import { Component, Input } from '@angular/core'
import { Layer } from 'mapbox-gl'

@Component({
  selector: 'app-layer',
  template: `
    <ng-container *ngFor="let layer of layers; trackBy: trackByFn">
      <mgl-layer *ngIf="layer" [id]="layer.id" [type]="layer.type" [source]="layer.source"></mgl-layer>
    </ng-container>
  `,
})
export class LayerComponent {
  @Input() layers: Layer[]
  @Input() visible = true

  trackByFn(index: number, item: any): string {
    return item.id || index
  }
}
