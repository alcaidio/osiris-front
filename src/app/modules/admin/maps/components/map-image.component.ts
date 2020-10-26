import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core'
import { Map, MapMouseEvent } from 'mapbox-gl'

@Component({
  selector: 'app-map-image',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/maps.component.scss'],
  template: `
    <mgl-map
      [style]="'mapbox://styles/mapbox/streets-v9'"
      [zoom]="14"
      [center]="[2.3573340555402185, 48.932427625380875]"
      [movingMethod]="'easeTo'"
      [attributionControl]="false"
      (click)="onClick($event)"
      (load)="onLoad($event)"
    >
      <!-- Controls -->
      <!-- Layers  -->

      <!-- Markers  -->
      <mgl-marker *ngIf="point" [lngLat]="[point.coordinates[0], point.coordinates[1]]">
        <div><img src="assets/images/pages/maps/camera.svg"></div>
      </mgl-marker>

    </mgl-map>
  `
})
export class MapImageComponent implements OnChanges {
  @Input() point: GeoJSON.Point
  @Output() position = new EventEmitter<GeoJSON.Position>()
  mapInstance: Map

  constructor() { }

  onLoad(evt: Map) {
    this.mapInstance = evt
  }

  ngOnChanges(): void {
    this.flyToPoint(this.point)
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.position.emit([lng, lat])
    }
  }

  private flyToPoint(point: GeoJSON.Point): void {
    if (point && this.mapInstance) {
      this.mapInstance.flyTo({ center: [point.coordinates[0], point.coordinates[1]] })
    }
  }

}
