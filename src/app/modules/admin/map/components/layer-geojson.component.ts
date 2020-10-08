import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { Layer } from '../models/layer.model'

@Component({
  selector: 'app-layer-geojson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="layer">
      <!-- <mgl-geojson-source [id]="layer.id">
        <mgl-feature *ngFor="let geometry of geometries" [geometry]="geometry"></mgl-feature>
      </mgl-geojson-source> -->
      <mgl-layer
        [id]="layer.id"
        [type]="layer.type"
        [source]="{ type: 'geojson', data: data.features[0] }"
        [layout]="layout"
        [paint]="paint"
        (click)="onClick($event)"
        (mouseEnter)="setCursorStyle('pointer')"
        (mouseLeave)="setCursorStyle('')"
      ></mgl-layer>
    </ng-container>
  `,
})
export class LayerGeojsonComponent implements OnChanges {
  @Input() layer: Layer
  @Input() data: GeoJSON.FeatureCollection
  @Output() cursor: EventEmitter<string> = new EventEmitter()
  geometry: any

  layout: {
    'line-join': 'round'
    'line-cap': 'round'
  }

  paint: {
    'line-color': '#000000'
    'line-width': 8
  }

  ngOnChanges() {
    console.log(this.data)
    console.log(this.data.features[0])
  }

  onClick(evt: any) {
    console.log(evt)
  }

  setCursorStyle(type: string) {
    this.cursor.emit(type)
  }
}
