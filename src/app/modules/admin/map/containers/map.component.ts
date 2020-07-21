import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Section } from '../models/map.model'
import { MapService } from '../services/map.service'

@Component({
  selector: 'app-map',
  styleUrls: ['./map.component.scss'],
  template: `
    <div class="content-layout right-sidebar-fullheight-basic-inner-scroll">
      <mat-drawer-container>
        <!-- Drawer -->
        <mat-drawer [autoFocus]="false" [mode]="'side'" [opened]="false" [position]="'end'" #matDrawer>
          <app-section-details [section]="feature"></app-section-details>
        </mat-drawer>

        <mat-drawer-content>
          <mgl-map
            #mapbox
            [style]="'mapbox://styles/mapbox/outdoors-v9'"
            [zoom]="13.5"
            [center]="[2.189, 48.926]"
            [pitch]="0"
            [bearing]="0"
            [maxZoom]="20"
            [minZoom]="12"
            [cursorStyle]="cursorStyle"
            [trackResize]="true"
          >
            <mgl-control mglGeocoder position="top-right"></mgl-control>
            <mgl-control mglFullscreen position="top-left"></mgl-control>
            <mgl-control mglNavigation position="top-left"></mgl-control>
            <mgl-control mglScale position="bottom-right"></mgl-control>

            <app-layer
              *ngFor="let layer of layers"
              [id]="layer.id"
              [data]="layer.data | async"
              [color]="layer.color"
              (cursor)="toggleCursorStyle($event)"
              (selected)="onClick($event)"
            ></app-layer>
          </mgl-map>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class CustomMapComponent implements OnInit {
  sections$: Observable<Section[]>
  goodSections$: Observable<Section[]>
  mediumSections$: Observable<Section[]>
  poorSections$: Observable<Section[]>
  veryPoorSections$: Observable<Section[]>
  outSections$: Observable<Section[]>
  cursorStyle = ''
  layers: any
  fit: any

  feature: MapboxGeoJSONFeature

  @ViewChild('mapbox')
  map: MapComponent

  @ViewChild('matDrawer')
  matDrawer: MatDrawer

  constructor(private _mapService: MapService) {}

  ngOnInit(): void {
    this.sections$ = this._mapService.getSections()
    this.generateLayers()
    this.layers = [
      { id: 'good', data: this.goodSections$, color: '#48bb78' },
      { id: 'medium', data: this.mediumSections$, color: '#ecc94b' },
      { id: 'poor', data: this.poorSections$, color: '#ed8936' },
      { id: 'very_poor', data: this.veryPoorSections$, color: '#e53e3e' },
      { id: 'out', data: this.outSections$, color: '#cbd5e0' },
    ]
  }

  private generateLayers(): void {
    this.goodSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Bon'))
    )
    this.mediumSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Moyen'))
    )
    this.poorSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Mauvais'))
    )
    this.veryPoorSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Très mauvais'))
    )
    this.outSections$ = this.sections$.pipe(
      map((sections) =>
        sections.filter(
          (section) =>
            section.properties.etat_ch !== 'Bon' &&
            section.properties.etat_ch !== 'Moyen' &&
            section.properties.etat_ch !== 'Mauvais' &&
            section.properties.etat_ch !== 'Très mauvais'
        )
      )
    )
  }

  toggleCursorStyle(evt: string): void {
    evt === '' ? (this.cursorStyle = '') : (this.cursorStyle = 'pointer')
  }

  onClick(evt: MapMouseEvent): void {
    const feature = this.map.mapInstance.queryRenderedFeatures(evt.point, {
      layers: ['good', 'medium', 'poor', 'very_poor', 'out'],
    })[0]

    this.feature = feature

    // FIX when bbox is send by back i can remove this
    const geometry = feature.geometry['coordinates']
    const length = geometry.length
    const first = geometry[0]
    const last = geometry[length - 1]
    this.fit = [
      [first[0], first[1]],
      [last[0], last[1]],
    ]

    this.map.mapInstance.fitBounds(this.fit, { padding: 275 })
    this.matDrawer.open()
  }
}
