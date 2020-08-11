import { Component, Injectable, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Select, Store } from '@ngxs/store'
import { GeoJSONSource, Map, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable } from 'rxjs'
import { Layer } from '../models/layer.model'
import { LoadLayers } from './../store/actions/layer.action'
import { GetSectionId } from './../store/actions/section.action'
import { LayersState } from './../store/states/layer.state'

@Component({
  selector: 'app-map',
  styleUrls: ['./styles/map.component.scss'],
  template: `
    <div class="content-layout right-sidebar-fullheight-basic-inner-scroll">
      <mat-drawer-container>
        <!-- Drawer -->
        <mat-drawer [mode]="'side'" [position]="'end'" [disableClose]="true" #matDrawer>
          <div class="content-layout fullwidth-basic-inner-scroll">
            <router-outlet></router-outlet>
          </div>
        </mat-drawer>

        <mat-drawer-content>
          <app-drawer-switch [drawer]="matDrawer"></app-drawer-switch>
          <app-buttons-menu></app-buttons-menu>
          <app-map-tools (action)="updateMode($event)"></app-map-tools>
          <app-switch-map-style (style)="switchMapStyle($event)"></app-switch-map-style>
          <mgl-map
            #mapbox
            [style]="'mapbox://styles/mapbox/' + layerId"
            [zoom]="11"
            [maxBounds]="[3.5, 44, 6, 48]"
            [center]="[4.28596, 46.28486]"
            [pitch]="0"
            [bearing]="0"
            (click)="onClick($event)"
          >
            <!-- Controls -->
            <mgl-control mglFullscreen position="top-left"></mgl-control>
            <mgl-control mglNavigation position="top-left"></mgl-control>
            <mgl-control mglScale position="bottom-left"></mgl-control>
            <mgl-control
              mglGeocoder
              [proximity]="[4.28596, 46.28486]"
              [bbox]="[4, 46, 4.5, 46.5]"
              placeholder="Search"
              position="bottom-right"
            ></mgl-control>
            <!-- Layers  -->
            <app-layer [layers]="layers$ | async"></app-layer>
          </mgl-map>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
@Injectable({
  providedIn: 'root',
})
export class CustomMapComponent implements OnInit {
  @Select(LayersState.getLayers) layers$: Observable<Layer[]>
  @ViewChild('mapbox', { static: true }) map: MapComponent
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer
  layerId: string
  mode: string | null

  // GeoJSON object to hold our measurement features
  geojson = {
    type: 'FeatureCollection',
    features: [],
  }

  // Used to draw a line between points
  linestring = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
  }

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.mode = null
    this.store.dispatch(new LoadLayers())
    this.layerId = 'streets-v11'
    initializeMeasure(this.map.mapInstance)
  }

  updateMode(evt: string) {
    this.mode = evt
  }

  onClick(evt: MapMouseEvent): void {
    if (this.mode === 'distance') {
      if (evt.lngLat) {
        if (this.geojson.features.length > 1) {
          this.geojson.features.pop()
        }
        const point = pointConstruction(evt.lngLat.lng, evt.lngLat.lat)
        this.geojson.features.push(point)
        console.log(this.geojson)

        if (this.geojson.features.length > 1) {
          this.linestring.geometry.coordinates = this.geojson.features.map((p) => p.geometry.coordinates)
          this.geojson.features.push(this.linestring)
          console.log(this.linestring)
        }
        const source = this.map.mapInstance.getSource('distance') as GeoJSONSource

        source.setData(this.geojson as any)
      }
    } else {
      if (evt.lngLat) {
        const { lng, lat } = evt.lngLat
        this.store.dispatch(new GetSectionId({ lng, lat }))
      }
    }
  }

  switchMapStyle(evt: string): void {
    this.layerId = evt
  }
}

export const pointConstruction = (lng: number, lat: number) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    properties: {
      id: String(new Date().getTime()),
    },
  }
}

export const initializeMeasure = (map: Map) => {
  map.addSource('distance', {
    type: 'geojson',
    data: this.geojson,
  })

  map.addLayer({
    id: 'measure-points',
    type: 'circle',
    source: 'distance',
    paint: {
      'circle-radius': 5,
      'circle-color': '#000',
    },
    filter: ['in', '$type', 'Point'],
  })

  map.addLayer({
    id: 'measure-lines',
    type: 'line',
    source: 'geojson',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 2.5,
    },
    filter: ['in', '$type', 'LineString'],
  })
}
