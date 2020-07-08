import { Component, Input } from '@angular/core'
import { Feature } from './../map.model'

@Component({
  selector: 'app-layer',
  template: `
    <ng-container *ngIf="data && id">
      <mgl-geojson-source [id]="id">
        <mgl-feature
          *ngFor="let section of data"
          [geometry]="section.geometry"
          [properties]="section.properties"
        ></mgl-feature>
      </mgl-geojson-source>
      <mgl-layer
        [id]="id"
        type="line"
        [source]="id"
        [layout]="{
          'line-join': 'round',
          'line-cap': 'round'
        }"
        [paint]="{
          'line-color': color,
          'line-width': width
        }"
      >
      </mgl-layer>
    </ng-container>
  `,
})
export class LayerComponent {
  @Input() id: string
  @Input() data: Feature
  @Input() color: string
  @Input() width = 5
}
