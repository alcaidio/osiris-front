import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Select, Store } from '@ngxs/store'
import { Map, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable } from 'rxjs'
import { Layer } from '../models/layer.model'
import { BaseMapState, LoadBaseMap, SaveBaseMapConfig, UIState } from '../store'
import { BaseMap } from './../models/base-map.model'
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
          <app-switch-map-style></app-switch-map-style>
          <mgl-map
            #mapbox
            [style]="(baseMap$ | async)?.style"
            [center]="(baseMap$ | async)?.center"
            [zoom]="[(baseMap$ | async)?.zoom]"
            [pitch]="[(baseMap$ | async)?.pitch]"
            [bearing]="[(baseMap$ | async)?.bearing]"
            [maxBounds]="(baseMap$ | async)?.maxBounds"
            (click)="onClick($event)"
          >
            <!-- Controls -->
            <mgl-control mglFullscreen position="top-left"></mgl-control>
            <mgl-control mglNavigation position="top-left"></mgl-control>
            <mgl-control mglScale position="bottom-left"></mgl-control>
            <mgl-control
              mglGeocoder
              [proximity]="(baseMap$ | async)?.center"
              [bbox]="(baseMap$ | async)?.maxBounds"
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
export class CustomMapComponent implements OnInit, OnDestroy {
  @Select(BaseMapState.getBaseMap) baseMap$: Observable<BaseMap>
  @Select(LayersState.getLayers) layers$: Observable<Layer[]>
  @Select(UIState.getDrawer) drawer$: Observable<MatDrawer>
  @ViewChild('mapbox', { static: true }) map: MapComponent

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .dispatch(new LoadBaseMap())
      .toPromise()
      .then(() => {
        this.store.dispatch(new LoadLayers())
      })
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.store.dispatch(new GetSectionId({ lng, lat }))
    }
  }

  ngOnDestroy(): void {
    const map = this.getBaseMapConfig(this.map.mapInstance)
    this.store.dispatch(new SaveBaseMapConfig(map))
  }

  private getBaseMapConfig(map: Map): Partial<BaseMap> {
    const { lng, lat } = map.getCenter()
    return {
      center: [lng, lat],
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
    }
  }
}
