import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { Layer } from '../models/layer.model'

@Component({
  selector: 'app-layer-geojson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="layer">
      <mgl-geojson-source [id]="layer.id" [data]="data"> </mgl-geojson-source>
      <mgl-layer
        [id]="layer.id"
        [type]="layer.type"
        [source]="layer.id"
        [layout]="layout"
        [paint]="layer.paint"
        (click)="onClick($event)"
        (mouseEnter)="setCursorStyle('pointer')"
        (mouseLeave)="setCursorStyle('')"
      ></mgl-layer>
    </ng-container>
  `,
})
export class LayerGeojsonComponent implements OnChanges {
  @Input() layer: Layer
  @Input() data: GeoJSON.Feature | GeoJSON.FeatureCollection | string
  @Output() cursor: EventEmitter<string> = new EventEmitter()

  layout: {
    'line-join': 'round'
    'line-cap': 'round'
  }

  ngOnChanges() {
    console.log(this.data)
  }

  onClick(evt: any) {
    console.log(evt)
  }

  setCursorStyle(type: string) {
    this.cursor.emit(type)
  }
}
