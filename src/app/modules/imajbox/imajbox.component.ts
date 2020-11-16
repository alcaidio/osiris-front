import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { BaseMap, MapConfig, Picture, PicturePoint } from '../../shared/models'
import { CameraPositionType } from './../../shared/models/maps.model'
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
          <app-flat-image [picture]="selectedPicture$ | async" [zoom]="true"></app-flat-image>
        </ng-container>
      </ng-container>

      <!-- Foreground  -->
      <ng-container foreground>
        <div class="flex flex-column">
          <ng-container *ngIf="imageInBig$ | async">
            <div class="in-front">
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
            </div>
          </ng-container>
          <ng-container *ngIf="!(imageInBig$ | async) && (picturesPoint$ | async)?.pictures">
            <div class="in-front">
              <app-flat-image
                [picture]="selectedPicture$ | async"
                [matTooltip]="
                  ((selectedPicture$ | async)?.camera | titlecase) +
                  ' camera &bull; ' +
                  ((picturesPoint$ | async)?.timestamp | date: 'medium')
                "
                [matTooltipPosition]="'below'"
              ></app-flat-image>
            </div>
          </ng-container>

          <mat-list *ngIf="(picturesPoint$ | async)?.pictures">
            <mat-list-item>
              <button
                mat-mini-fab
                color="accent"
                (click)="onToggleMinimize()"
                [matTooltip]="
                  (imageInBig$ | async) ? ('imajbox.image.extand' | transloco) : ('imajbox.image.minimize' | transloco)
                "
                matTooltipPosition="after"
              >
                <mat-icon>menu_open</mat-icon>
              </button>
            </mat-list-item>
            <mat-list-item>
              <button
                mat-mini-fab
                color="accent"
                (click)="onToggleForeground()"
                [matTooltip]="
                  (imageInBig$ | async) ? ('imajbox.map.extand' | transloco) : ('imajbox.map.extand' | transloco)
                "
                matTooltipPosition="after"
              >
                <mat-icon>fullscreen</mat-icon>
              </button>
            </mat-list-item>
            <mat-list-item>
              <button
                mat-mini-fab
                color="accent"
                [matTooltip]="'imajbox.camera.select' | transloco"
                matTooltipPosition="after"
                mat-menu
                [matMenuTriggerFor]="cameraMenu"
                xPosition="after"
              >
                <mat-icon class="icon-size-16">switch_camera</mat-icon>
              </button>
              <mat-menu #cameraMenu="matMenu">
                <ng-container *ngFor="let picture of (picturesPoint$ | async)?.pictures">
                  <button
                    [disabled]="(selectedPicture$ | async)?.camera === picture.camera"
                    mat-menu-item
                    (click)="onChangeCameraPosition(picture.camera)"
                  >
                    {{ picture.camera | titlecase }}
                  </button>
                </ng-container>
              </mat-menu>
            </mat-list-item>
          </mat-list>
        </div>
      </ng-container>

      <!-- Fab  -->
      <ng-container fab>
        <button
          *ngIf="!(imageInBig$ | async) && (picturesPoint$ | async)?.pictures"
          mat-fab
          color="accent"
          (click)="onToggleMinimize()"
          [matTooltip]="'imajbox.fab.images' | transloco"
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
          [matTooltip]="'imajbox.fab.map' | transloco"
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
      ::ng-deep .mat-menu-panel {
        margin-top: 10px !important;
      }

      .in-front {
        width: 400px;
        height: 250px;
        min-width: 400px;
        max-width: 400px;
        min-height: 250px;
        max-height: 250px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border-radius: 8px;
        border: 1px solid #bdc2d1;
        overflow: hidden;
        background-color: #e5e7ec;
        cursor: help;
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

  onChangeCameraPosition(position: CameraPositionType): void {
    this.store.dispatch(new ChangeCameraPosition(position))
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
