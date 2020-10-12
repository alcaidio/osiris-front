import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Select, Store } from '@ngxs/store'
import { Map, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable } from 'rxjs'
import { Item } from '../components/button-fab-map.component'
import { Layer } from '../models/layer.model'
import { BaseMapState, GetSectionId, LayersState, LoadBaseMap, UIState } from '../store'
import { BaseMap } from './../models/base-map.model'
import { GetActiveMap, SaveActiveMap } from './../store/actions/base-map.action'
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
          <router-outlet></router-outlet>
        </mat-drawer>

        <mat-drawer-content>
          <ng-container *ngIf="isLoaded$ | async">
            <app-drawer-switch></app-drawer-switch>
            <app-buttons-menu></app-buttons-menu>
            <div class="absolute left-0 z-99" style="top: 75%">
              <div class="relative ml-4">
                <app-button-fab-map [iconFirst]="'feather:tool'" [items]="mapTools"></app-button-fab-map>
              </div>
            </div>
            <div class="absolute left-0 z-99" style="top: 83%">
              <div class="relative ml-4">
                <app-button-fab-map
                  [iconFirst]="'feather:map'"
                  [items]="mapStyle"
                  [isImage]="true"
                ></app-button-fab-map>
              </div>
            </div>

            <mgl-map
              #mapbox
              class="map"
              (load)="onLoad($event)"
              [style]="(activeMap$ | async)?.style"
              [pitch]="(defaultOrSavedMap$ | async)?.pitch"
              [bounds]="(defaultOrSavedMap$ | async)?.bounds"
              [maxBounds]="(defaultOrSavedMap$ | async)?.maxBounds"
              (click)="onClick($event)"
              (dragEnd)="getActiveMap()"
              (zoomEnd)="getActiveMap()"
              (pitchEnd)="getActiveMap()"
              [movingMethod]="'easeTo'"
            >
              <!-- Controls -->
              <mgl-control mglFullscreen position="top-left"></mgl-control>
              <mgl-control mglNavigation position="top-left"></mgl-control>
              <mgl-control mglScale position="bottom-left"></mgl-control>
              <mgl-control
                mglGeocoder
                [proximity]="(activeMap$ | async)?.center"
                [bbox]="(defaultOrSavedMap$ | async)?.bounds"
                placeholder="Recherche"
                position="bottom-right"
              ></mgl-control>
              <!-- Layers  -->
              <app-layer [layers]="layers$ | async"></app-layer>
              <app-buildings [visible]="isBuildings$ | async"></app-buildings>
            </mgl-map>
          </ng-container>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
@Injectable({
  providedIn: 'root',
})
export class CustomMapComponent implements OnInit, OnDestroy {
  @Select(BaseMapState.getSavedMapOrDefault) defaultOrSavedMap$: Observable<BaseMap>
  @Select(BaseMapState.getActiveMap) activeMap$: Observable<BaseMap>
  @Select(BaseMapState.getLoaded) isLoaded$: Observable<boolean>

  @Select(BaseMapState.isBuildings) isBuildings$: Observable<boolean>
  @Select(LayersState.getLayers) layers$: Observable<Layer[]>
  @Select(UIState.getDrawer) drawer$: Observable<MatDrawer>

  @ViewChild('mapbox', { static: true }) map: MapComponent
  mapInstance: Map
  mapTools: Item[]
  mapStyle: Item[]

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadBaseMap())
    this.store.dispatch(new LoadLayers())

    this.mapTools = [
      { id: '3d', icon: 'feather:codepen', tooltip: '3D', action: '3d' },
      { id: 'distance', icon: 'iconsmind:ruler', tooltip: 'Distance' },
    ]

    this.mapStyle = [
      {
        id: 'mapbox://styles/mapbox/outdoors-v11',
        icon: 'assets/images/topografic-map.png',
        tooltip: 'Topografic map',
        action: 'switchMap',
      },
      {
        id: 'mapbox://styles/mapbox/streets-v11',
        icon: 'assets/images/light-map.png',
        tooltip: 'Light map',
        action: 'switchMap',
      },
      {
        id: 'mapbox://styles/mapbox/satellite-v9',
        icon: 'assets/images/satellite-map.png',
        tooltip: 'Satellite map',
        action: 'switchMap',
      },
      {
        id: 'mapbox://styles/mapbox/dark-v10',
        icon: 'assets/images/dark-map.png',
        tooltip: 'Dark map',
        action: 'switchMap',
      },
    ]
  }

  onLoad(evt: Map) {
    this.mapInstance = evt
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.store.dispatch(new GetSectionId({ lng, lat }))
    }
  }

  getActiveMap() {
    if (this.mapInstance !== undefined) {
      this.store.dispatch(new GetActiveMap(this.getBaseMapConfig()))
    }
  }

  private getBaseMapConfig(): Partial<BaseMap> {
    const { lng, lat } = this.mapInstance.getCenter()
    return {
      center: [lng, lat],
      zoom: this.mapInstance.getZoom(),
      pitch: this.mapInstance.getPitch(),
      bearing: this.mapInstance.getBearing(),
      bounds: this.mapInstance.getBounds(),
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new SaveActiveMap())
  }
}
