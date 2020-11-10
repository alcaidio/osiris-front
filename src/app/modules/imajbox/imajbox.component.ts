import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { BaseMap, MapConfig, Picture, PicturePoint } from '../../shared/models'
import {
  BaseMapState,
  ChangeCameraPosition,
  LoadBaseMap,
  LoadPicturesPoint,
  PicturesState,
  SetMapConfig,
  ToggleForeground,
  ToggleMinimize,
  UiState,
} from './store'

AutoUnsubscribe()
@Component({
  selector: 'app-imajbox',
  template: `
    <app-template-one [minimize]="minimize$ | async">
      <!-- Background  -->
      <ng-container background>
        <ng-container *ngIf="!(imageInBig$ | async)">
          <app-mapbox
            *ngIf="baseMap$ | async as map"
            [baselayers]="map.baselayers"
            [config]="map.config"
            [overlays]="map.overlays"
            [point]="(picturesPoint$ | async)?.geom"
            (position)="getNearestPoint($event)"
            (mapConfig)="setMapConfig($event)"
            [direction]="(selectedPicture$ | async)?.direction"
            [mapInBig]="!(imageInBig$ | async)"
          ></app-mapbox>
        </ng-container>
        <ng-container *ngIf="imageInBig$ | async">
          <app-flat-image
            [picture]="selectedPicture$ | async"
            [zoom]="true"
            (cameraTooltipMessage)="this.cameraTooltipMessage = $event"
          ></app-flat-image>
        </ng-container>
      </ng-container>

      <!-- Foreground  -->
      <ng-container foreground>
        <ng-container *ngIf="imageInBig$ | async">
          <app-mapbox
            *ngIf="baseMap$ | async as map"
            [baselayers]="map.baselayers"
            [config]="map.config"
            [overlays]="map.overlays"
            [point]="(picturesPoint$ | async)?.geom"
            (position)="getNearestPoint($event)"
            (mapConfig)="setMapConfig($event)"
            [direction]="(selectedPicture$ | async)?.direction"
            [mapInBig]="!(imageInBig$ | async)"
          ></app-mapbox>
        </ng-container>
        <ng-container *ngIf="!(imageInBig$ | async)">
          <app-flat-image
            [picture]="selectedPicture$ | async"
            (cameraTooltipMessage)="this.cameraTooltipMessage = $event"
          ></app-flat-image>
        </ng-container>

        <!-- Bottom right button -->
        <div
          class="absolute right-0 bottom-0"
          (click)="onToggleForeground()"
          [matTooltip]="'Etendre'"
          matTooltipPosition="below"
        >
          <div class="triangle relative"></div>
          <span class="material-icons absolute right-0 bottom-0 p-1 z-40 cursor-pointer">south_east</span>
        </div>
        <!-- Top left button -->
        <div class="absolute left-0 top-0">
          <button
            mat-icon-button
            color="primary"
            (click)="onToggleMinimize()"
            [matTooltip]="'Réduire'"
            matTooltipPosition="after"
          >
            <mat-icon class="icon-size-16">close</mat-icon>
          </button>
        </div>
        <!-- Top right button -->
        <div class="absolute right-0 top-0">
          <button
            mat-icon-button
            color="primary"
            (click)="onChangeCameraPosition()"
            [matTooltip]="cameraTooltipMessage"
            matTooltipPosition="after"
          >
            <mat-icon class="icon-size-16">switch_camera</mat-icon>
          </button>
        </div>
      </ng-container>

      <!-- Fab  -->
      <ng-container fab>
        <button
          *ngIf="!(imageInBig$ | async)"
          mat-fab
          color="accent"
          (click)="onToggleMinimize()"
          [matTooltip]="'Ouvrir les images'"
          matTooltipPosition="after"
          class="relative"
        >
          <mat-icon>camera_alt</mat-icon>
          <span
            class="tip absolute right-0 top-0 -mr-3 mt-2"
            [matBadge]="(picturesPoint$ | async)?.pictures.length"
            matBadgePosition="after"
            matBadgeColor="primary"
          ></span>
        </button>
        <button
          *ngIf="imageInBig$ | async"
          mat-fab
          color="accent"
          (click)="onToggleMinimize()"
          [matTooltip]="'Ouvrir la carte'"
          matTooltipPosition="after"
        >
          <mat-icon>map</mat-icon>
        </button>
      </ng-container>
    </app-template-one>
  `,
  styles: [
    `
      .tip {
        animation: beat 600ms infinite alternate;
        transform-origin: center;
      }

      @keyframes beat {
        to {
          transform: scale(1.2);
        }
      }
    `,
  ],
})
export class ImajboxComponent implements OnInit, OnDestroy {
  @Select(BaseMapState.getMap) baseMap$: Observable<BaseMap>
  // TODO : template load bones
  // @Select(BaseMapState.getLoading) isLoading$: Observable<boolean>
  @Select(UiState.getImageInBig) imageInBig$: Observable<boolean>
  @Select(UiState.getMinimize) minimize$: Observable<boolean>
  @Select(PicturesState.getSelectedPicturesPoint) picturesPoint$: Observable<PicturePoint>
  @Select(PicturesState.getSelectedPicture) selectedPicture$: Observable<Picture>

  cameraTooltipMessage: string
  imageFront = true

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadBaseMap())
  }

  onToggleForeground(): void {
    this.store.dispatch(new ToggleForeground())
  }

  onToggleMinimize(): void {
    this.store.dispatch(new ToggleMinimize())
  }

  onChangeCameraPosition(): void {
    // TODO: plus tard mettre ceci dans le store
    this.selectedPicture$.pipe(take(1)).subscribe((selected: Picture) => {
      if (selected.camera === 'front') {
        this.store.dispatch(new ChangeCameraPosition('back'))
      } else {
        this.store.dispatch(new ChangeCameraPosition('front'))
      }
    })
  }

  getNearestPoint(position: GeoJSON.Position) {
    this.store.dispatch(new LoadPicturesPoint(position))
  }

  setMapConfig(evt: Partial<MapConfig>) {
    this.store.dispatch(new SetMapConfig(evt))
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}
