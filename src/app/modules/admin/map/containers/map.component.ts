import { Component, Injectable, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Select, Store } from '@ngxs/store'
import { MapMouseEvent } from 'mapbox-gl'
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
          <mgl-map
            #mapbox
            [style]="'mapbox://styles/mapbox/outdoors-v11'"
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadLayers())
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.store.dispatch(new GetSectionId({ lng, lat }))
    }
  }
}
