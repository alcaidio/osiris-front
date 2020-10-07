import { Component, Injectable, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Select, Store } from '@ngxs/store'
import { Map, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable } from 'rxjs'
import { Layer } from '../models/layer.model'
import { BaseMapState, GetSectionId, LayersState, LoadBaseMap, UIState } from '../store'
import { BaseMap } from './../models/base-map.model'
import { GetActiveMap } from './../store/actions/base-map.action'
import { LoadLayers } from './../store/actions/layer.action'

@Component({
  selector: 'app-map',
  styleUrls: ['./styles/map.component.scss'],
  template: `
    <div class="content-layout right-sidebar-fullheight-basic-inner-scroll">
      <mat-drawer-container>
        <!-- Drawer -->
        <mat-drawer
          [mode]="(drawer$ | async)?.mode"
          [position]="(drawer$ | async)?.position"
          [opened]="(drawer$ | async)?.opened"
        >
          <div class="content-layout fullwidth-basic-inner-scroll">
            <router-outlet></router-outlet>
          </div>
        </mat-drawer>

        <mat-drawer-content>
          <app-drawer-switch></app-drawer-switch>
          <app-buttons-menu></app-buttons-menu>
          <app-map-tools></app-map-tools>
          <app-switch-map-style></app-switch-map-style>
          <mgl-map
            #mapbox
            [movingMethod]="'jumpTo'"
            [style]="(activeMap$ | async)?.style"
            [center]="(activeMap$ | async)?.center"
            [zoom]="[(activeMap$ | async)?.zoom]"
            [pitch]="[(activeMap$ | async)?.pitch]"
            [bearing]="[(activeMap$ | async)?.bearing]"
            [maxBounds]="(activeMap$ | async)?.maxBounds"
            (click)="onClick($event)"
            (dragEnd)="getActiveMap()"
            (zoomEnd)="getActiveMap()"
          >
            <!-- Controls -->
            <mgl-control mglFullscreen position="top-left"></mgl-control>
            <mgl-control mglNavigation position="top-left"></mgl-control>
            <mgl-control mglScale position="bottom-left"></mgl-control>
            <mgl-control
              mglGeocoder
              [proximity]="(activeMap$ | async)?.center"
              [bbox]="(activeMap$ | async)?.maxBounds"
              placeholder="Search"
              position="bottom-right"
            ></mgl-control>
            <!-- Layers  -->
            <app-layer [layers]="layers$ | async"></app-layer>
            <app-buildings [visible]="isBuildings$ | async"></app-buildings>
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
  @Select(BaseMapState.getActiveMap) activeMap$: Observable<BaseMap>
  @Select(BaseMapState.isBuildings) isBuildings$: Observable<boolean>
  @Select(LayersState.getLayers) layers$: Observable<Layer[]>
  @Select(UIState.getDrawer) drawer$: Observable<MatDrawer>
  @ViewChild('mapbox', { static: true }) map: MapComponent

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadBaseMap())
    this.store.dispatch(new LoadLayers())
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.store.dispatch(new GetSectionId({ lng, lat }))
    }
  }

  getActiveMap() {
    this.store.dispatch(new GetActiveMap(this.getBaseMapConfig(this.map.mapInstance)))
  }

  private getBaseMapConfig(baseMap: Map): Partial<BaseMap> {
    const { lng, lat } = baseMap.getCenter()
    return {
      center: [lng, lat],
      zoom: baseMap.getZoom(),
      pitch: baseMap.getPitch(),
      bearing: baseMap.getBearing(),
    }
  }
}
