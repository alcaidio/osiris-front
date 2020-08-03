import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Layer, MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
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
            [zoom]="14"
            [center]="[4.28596, 46.28486]"
            [pitch]="0"
            [bearing]="0"
            [cursorStyle]="cursorStyle"
            [trackResize]="true"
            (click)="onClick($event)"
          >
            <mgl-control mglGeocoder position="top-right"></mgl-control>
            <mgl-control mglFullscreen position="top-left"></mgl-control>
            <mgl-control mglNavigation position="top-left"></mgl-control>
            <mgl-control mglScale position="bottom-right"></mgl-control>

            <mgl-layer
              *ngFor="let layer of layers$ | async"
              [id]="layer.id"
              [type]="layer.type"
              [source]="layer.source"
            ></mgl-layer>
          </mgl-map>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class CustomMapComponent implements OnInit {
  @ViewChild('mapbox') map: MapComponent
  @ViewChild('matDrawer') matDrawer: MatDrawer
  layers$: Observable<Layer[]>
  cursorStyle = ''
  feature: MapboxGeoJSONFeature

  constructor(private _mapService: MapService) {}

  ngOnInit(): void {
    this.layers$ = this._mapService.getLayers()
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this._mapService
        .getSection({ lng, lat })
        .pipe(take(1))
        .subscribe((f) => {
          if (f !== null) {
            this.zoom(f)
            // this.matDrawer.open()
          }
        })
    }
  }

  // TODO : create section Model
  private zoom(section: any) {
    const coordinates = section.geometry.coordinates
    const length = coordinates.length
    const first = coordinates[0]
    const last = coordinates[length - 1]
    this.map.mapInstance.fitBounds(
      [
        [first[0], first[1]],
        [last[0], last[1]],
      ],
      { padding: 275 }
    )
  }
}
