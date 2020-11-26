import { Component, OnDestroy, OnInit } from '@angular/core'
import { Params } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { RouterSelectors } from 'app/core/store/states/router.state.selector'
import { BaseMap, Picture, PicturePoint } from 'app/shared/models'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import {
  BaseMapState,
  ChangeCameraPosition,
  LoadBaseMap,
  LoadBaseMapWithParams,
  LoadPicturesPointById,
  LoadPicturesPointByLngLat,
  PicturesState,
  SetForeground,
  SetMapConfig,
  SetMinimize,
  ToggleForeground,
} from '../store'
import { CameraPositionType, MapConfig } from './../../../shared/models/maps.model'
import { QueryParamsFromImajebox } from './imajbox.component'

AutoUnsubscribe()
@Component({
  selector: 'app-split-view',
  template: `
    <app-template-three>
      <ng-container left>
        <app-mapbox
          *ngIf="baseMap$ | async as map"
          [baselayers]="map.baselayers"
          [config]="map.config"
          [overlays]="map.overlays"
          [point]="(picturesPoint$ | async)?.geom"
          (position)="getNearestPoint($event)"
          (mapConfig)="setMapConfig($event)"
          [direction]="(selectedPicture$ | async)?.direction"
          [mapInBig]="true"
          (loaded)="onMapLoad($event)"
          [dragend]="dragEnd"
        ></app-mapbox>
        <app-drag-and-search
          (dragEnd)="dragEnd = true"
          class="absolute left-0 top-0 m-2"
          *ngIf="mapIsLoaded && (picturesPoint$ | async)"
        ></app-drag-and-search>
      </ng-container>
      <ng-container right>
        <ng-container *ngIf="picturesPoint$ | async; else nopoint">
          <app-flat-image [picture]="selectedPicture$ | async" [zoom]="true"></app-flat-image>
          <app-navigation-perspective
            [picturePoint]="picturesPoint$ | async"
            [picture]="selectedPicture$ | async"
          ></app-navigation-perspective>
          <div class="absolute bottom-0 right-0 mb-8 mr-2">
            <app-car-compass
              [pictures]="(picturesPoint$ | async)?.pictures"
              [selected]="(selectedPicture$ | async)?.camera"
              (camera)="onChangeCameraPosition($event)"
            ></app-car-compass>
          </div>
          <app-image-infos
            [point]="picturesPoint$ | async"
            [picture]="selectedPicture$ | async"
            class="m-3"
          ></app-image-infos>
          <div class="absolute top-0 right-0 m-3">
            <button
              mat-mini-fab
              color="accent"
              [matTooltip]="'imajbox.change-template' | transloco"
              matTooltipPosition="before"
              class="relative"
              routerLink="./split"
            >
              <mat-icon>looks_two</mat-icon>
            </button>
          </div>
        </ng-container>
        <ng-template #nopoint>
          <div class="h-full flex flex-col justify-center items-center	">
            <app-drag-and-search [tooltip]="false" (dragEnd)="dragEnd = true" class="m-2"></app-drag-and-search>
            <span class="text-base font-light antialiased mt-2">{{ 'imajbox.drag-man' | transloco }}</span>
          </div>
        </ng-template>
      </ng-container>
    </app-template-three>
  `,
  styles: [
    `
      app-navigation-perspective {
        position: absolute;
        bottom: 40px;
        left: calc(66.667% - 150px);
      }

      app-image-infos {
        position: absolute;
        top: 0px;
        left: 33.334%;
      }
    `,
  ],
})
export class SplitViewComponent implements OnInit, OnDestroy {
  @Select(BaseMapState.getMap) baseMap$: Observable<BaseMap>
  @Select(PicturesState.getSelectedPicturesPoint) picturesPoint$: Observable<PicturePoint>
  @Select(PicturesState.getSelectedPicture) selectedPicture$: Observable<Picture>
  @Select(RouterSelectors.queryParams) queryParams$: Observable<Params>

  mapIsLoaded = false
  dragEnd = false

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.queryParams$.pipe(take(1)).subscribe((queryParams) => {
      this.initState(queryParams)
    })
  }

  private initState(params: Params) {
    const bbox = params[QueryParamsFromImajebox.bbox]
    const point = params[QueryParamsFromImajebox.point]
    const minimize = params[QueryParamsFromImajebox.minimize]
    const image = params[QueryParamsFromImajebox.image]
    const camera = params[QueryParamsFromImajebox.camera]

    if (bbox) {
      this.store.dispatch(new LoadBaseMapWithParams(bbox))
    } else {
      this.store.dispatch(new LoadBaseMap())
    }
    if (point) {
      this.store.dispatch(new LoadPicturesPointById(point))
    }
    if (minimize) {
      this.store.dispatch(new SetMinimize(minimize))
    }
    if (image) {
      this.store.dispatch(new SetForeground(image))
    }
    if (camera) {
      this.store.dispatch(new ChangeCameraPosition(camera))
    }
  }

  onMapLoad(evt: boolean) {
    this.mapIsLoaded = evt
  }

  getNearestPoint(position: GeoJSON.Position) {
    const distance = 200
    this.store.dispatch(new LoadPicturesPointByLngLat({ position, distance }))
    if (this.dragEnd) {
      this.store.dispatch(new ToggleForeground())
    }
    this.dragEnd = false
  }

  setMapConfig(evt: Partial<MapConfig>) {
    this.store.dispatch(new SetMapConfig(evt))
  }

  onChangeCameraPosition(position: CameraPositionType): void {
    this.store.dispatch(new ChangeCameraPosition(position))
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}
