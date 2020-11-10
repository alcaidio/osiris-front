import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { Map, Visibility } from 'mapbox-gl'
import { Baselayer, MapConfig, Overlay } from '../../../shared/models/maps.model'

@Component({
  selector: 'app-mapbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mgl-map
      *ngIf="config && baselayers"
      class="h-full w-full"
      [style]="baselayers[config.style]?.url"
      [bounds]="config.bounds"
      [bearing]="config.bearing"
      [pitch]="config.pitch === null ? 0 : config.pitch"
      [zoom]="config.zoom"
      [center]="config.center"
      [maxBounds]="config.maxBounds"
      [minZoom]="config.minZoom === null ? 0 : config.minZoom"
      [maxZoom]="config.maxZoom === null ? 25 : config.maxZoom"
      [movingMethod]="'easeTo'"
      [attributionControl]="false"
      [cursorStyle]="cursorStyle"
      (load)="onLoad($event)"
      (dragEnd)="mapConfig.emit(baseMapConfig)"
      (zoomEnd)="mapConfig.emit(baseMapConfig)"
      (pitchEnd)="mapConfig.emit(baseMapConfig)"
    >
      <ng-container *ngIf="isLoaded">
        <!-- Controls -->

        <!-- Layers  -->
        <app-buildings-layer [visible]="baseMapConfig.pitch > 30"></app-buildings-layer>

        <ng-container *ngIf="overlays">
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
        <ng-container *ngIf="point && direction">
          <mgl-marker #pointMarker [lngLat]="[point.coordinates[0], point.coordinates[1]]">
            <!-- TODO: remove div when zoom > 16  -->
            <div>
              <!-- FIX: direction 0 not work -->
              <img
                class="cursor-pointer"
                src="assets/images/pages/maps/camera.svg"
                [style.transform]="'rotate(' + cameraRotation + 'deg)'"
                (click)="flyToPoint(this.point, 17)"
              />
            </div>
          </mgl-marker>
          <!-- <mgl-popup [marker]="pointMarker" [closeButton]="false" [closeOnClick]="true" [anchor]="'bottom'" [offset]="18">
          <img class="object-cover h-full w-full" src="assets/images/pages/maps/image-unvailable.png" />
        </mgl-popup> -->
        </ng-container>
      </ng-container>
      <!-- end of is loaded -->
    </mgl-map>
  `,
})
export class MapboxComponent implements OnInit, OnChanges {
  @Input() config: MapConfig
  @Input() baselayers: Baselayer[]
  @Input() overlays: Overlay[]
  @Input() point: GeoJSON.Point
  @Input() direction: number
  @Output() position = new EventEmitter<GeoJSON.Position>()
  @Output() mapConfig = new EventEmitter<Partial<MapConfig>>()
  cursorStyle: string
  isLoaded = false
  mapInstance: Map

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  onLoad(evt: Map) {
    this.isLoaded = true
    this.mapInstance = evt
    if (this.point) {
      this.flyToPoint(this.point)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'point':
            this.flyToPoint(this.point)
            break
        }
      }
    }
  }

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

  get cameraRotation() {
    return (this.config.bearing + this.direction) * -1
  }

  get baseMapConfig(): Partial<MapConfig> {
    const { lng, lat } = this.mapInstance.getCenter()
    return {
      center: [lng, lat],
      zoom: this.mapInstance.getZoom(),
      pitch: this.mapInstance.getPitch(),
      bearing: this.mapInstance.getBearing(),
      bounds: this.mapInstance.getBounds(),
    }
  }
}
