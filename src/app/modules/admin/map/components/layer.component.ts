import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MapMouseEvent } from 'mapbox-gl'
import { Feature } from '../models/map.model'

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
        (click)="selected.emit($event)"
        (mouseEnter)="emitEnter()"
        (mouseLeave)="emitLeave()"
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

  @Output() cursor = new EventEmitter<string>()
  @Output() selected = new EventEmitter<MapMouseEvent>()

  emitEnter(): void {
    // this.width += 5
    this.cursor.emit('pointer')
  }

  emitLeave(): void {
    // this.width -= 5
    this.cursor.emit('')
  }
}
