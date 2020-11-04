import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core'
import { Map, Visibility } from 'mapbox-gl'
import { Baselayer, MapConfig, Overlay } from '../models/maps.model'

@Component({
  selector: 'app-mapbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mgl-map
      *ngIf="config"
      class="h-full w-full"
      [style]="baselayers[config.style].url"
      [bounds]="config.bounds"
      [maxBounds]="config.maxBounds"
      [pitch]="config.pitch === null ? 0 : config.pitch"
      [minZoom]="config.minZoom"
      [movingMethod]="'easeTo'"
      [attributionControl]="false"
      (load)="onLoad($event)"
      [cursorStyle]="cursorStyle"
    >
      <!-- Controls -->

      <!-- Layers  -->
      <ng-container *ngIf="loaded && overlays">
        <ng-container *ngFor="let layer of overlays">
          <ng-container *ngIf="layer.type === 'raster'">
            <mgl-raster-source
              [id]="layer.id"
              [tiles]="layer.source.tiles"
              [tileSize]="layer.source.tileSize"
            ></mgl-raster-source>
            <!-- TODO: replace booleanToVisibility(true) by booleanToVisibility(layer.visible) -->
            <mgl-layer
              [id]="layer.id"
              [type]="layer.type"
              [source]="layer.id"
              [maxzoom]="15"
              [layout]="{ visibility: booleanToVisibility(true) }"
            ></mgl-layer>
          </ng-container>

          <ng-container *ngIf="layer.type !== 'raster'">
            <mgl-geojson-source [id]="'points-source'" [data]="layer.source.data"></mgl-geojson-source>
            <mgl-layer
              [id]="layer.id"
              [type]="layer.type"
              [source]="'points-source'"
              [minzoom]="15"
              [paint]="{
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 22, 15],
                'circle-opacity': 0.8,
                'circle-color': '#0FA8AF'
              }"
              (mouseEnter)="cursorStyle = 'pointer'"
              (mouseLeave)="cursorStyle = ''"
              (click)="onFeatureClick($event)"
              [layout]="{ visibility: booleanToVisibility(true) }"
            ></mgl-layer>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- Markers  -->
      <ng-container *ngIf="point">
        <mgl-marker #pointMarker [lngLat]="[point.coordinates[0], point.coordinates[1]]">
          <!-- TODO: remove div when zoom > 16  -->
          <div>
            <!-- TODO: add real rotation with direction -->
            <img
              class="cursor-pointer"
              src="assets/images/pages/maps/camera.svg"
              [style.transform]="'rotate(' + 90 + 'deg)'"
              (click)="flyToPoint(this.point, 17)"
            />
          </div>
        </mgl-marker>
        <!-- <mgl-popup [marker]="pointMarker" [closeButton]="false" [closeOnClick]="true" [anchor]="'bottom'" [offset]="18">
          <img class="object-cover h-full w-full" src="assets/images/pages/maps/image-unvailable.png" />
        </mgl-popup> -->
      </ng-container>
    </mgl-map>
  `,
})
export class MapboxComponent implements OnInit, OnChanges {
  @Input() config: MapConfig
  @Input() baselayers: Baselayer[]
  @Input() overlays: Overlay[]
  @Input() point: GeoJSON.Point
  @Output() position = new EventEmitter<GeoJSON.Position>()
  @Output() loaded = new EventEmitter<boolean>(false)
  mapInstance: Map
  cursorStyle: string

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  onLoad(evt: Map) {
    this.loaded.emit(true)
    this.mapInstance = evt
    if (this.point) {
      this.flyToPoint(this.point)
    }
  }

  ngOnChanges(): void {
    this.flyToPoint(this.point)
  }

  // No event by default but can add a click event listener on the map to trigger an action
  // (click)="onClick($event)"
  // onClick(evt: MapMouseEvent): void {
  //   if (evt.lngLat) {
  //     const { lng, lat } = evt.lngLat
  //     this.position.emit([lng, lat])
  //   }
  // }

  onFeatureClick(evt: any) {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.position.emit([lng, lat])
      this.cdr.detectChanges()
    }
  }

  booleanToVisibility(visible: boolean): Visibility {
    return visible ? 'visible' : 'none'
  }

  flyToPoint(point: GeoJSON.Point, zoom?: number): void {
    if (point && this.mapInstance) {
      if (zoom) {
        this.mapInstance.flyTo({ center: [point.coordinates[0], point.coordinates[1]], zoom: zoom })
      } else {
        this.mapInstance.flyTo({ center: [point.coordinates[0], point.coordinates[1]] })
      }
    }
  }
}
