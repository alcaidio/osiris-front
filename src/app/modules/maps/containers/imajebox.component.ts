import { Component, OnDestroy, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { shareReplay, take } from 'rxjs/operators'
import { Baselayer, BaseMap, MapConfig, Overlay, Picture, PicturePoint } from '../models/maps.model'
import { PictureService } from '../services/picture.service'

@Component({
  selector: 'app-imajebox',
  template: `
    <app-template-one [minimize]="minimize">
      <!-- Background  -->
      <ng-container background>
        <ng-container *ngIf="!imageInBig">
          <app-mapbox
            [config]="mapConfig"
            [baselayers]="baselayers"
            [overlays]="overlays"
            [point]="point"
            (position)="getNearestPoint($event)"
          ></app-mapbox>
        </ng-container>
        <ng-container *ngIf="imageInBig">
          <app-image
            [pictures]="pictures"
            [firstImage]="imageFront"
            [zoom]="true"
            (cameraTooltipMessage)="this.cameraTooltipMessage = $event"
          ></app-image>
        </ng-container>
      </ng-container>

      <!-- Foreground  -->
      <ng-container foreground>
        <ng-container *ngIf="imageInBig">
          <app-mapbox
            [config]="mapConfig"
            [baselayers]="baselayers"
            [overlays]="overlays"
            [point]="point"
            (position)="getNearestPoint($event)"
          ></app-mapbox>
        </ng-container>
        <ng-container *ngIf="!imageInBig">
          <app-image
            [pictures]="pictures"
            [firstImage]="imageFront"
            (cameraTooltipMessage)="this.cameraTooltipMessage = $event"
          ></app-image>
        </ng-container>

        <!-- Bottom right button -->
        <div
          class="absolute right-0 bottom-0"
          (click)="onToggleTemplate()"
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
            (click)="onToggleImageToDisplay()"
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
          *ngIf="!imageInBig"
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
            [matBadge]="pictureLength"
            matBadgePosition="after"
            matBadgeColor="primary"
          ></span>
        </button>
        <button
          *ngIf="imageInBig"
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
export class ImajeboxComponent implements OnInit, OnDestroy {
  baseMap$: Observable<BaseMap>
  pictures: Picture[]
  baselayers: Baselayer[]
  overlays: Overlay[]
  mapConfig: MapConfig
  cameraTooltipMessage: string
  point: GeoJSON.Point
  pictureLength: number

  // UI
  imageFront = true
  imageInBig = false
  minimize = true

  constructor(private service: PictureService) {}

  ngOnInit(): void {
    this.baseMap$ = this.service.getBaseMap().pipe(take(1), shareReplay())

    this.baseMap$.subscribe((basemap: BaseMap) => {
      const { id, overlays, baselayers, ...config } = basemap
      this.overlays = overlays
      this.baselayers = baselayers
      this.mapConfig = config as any
    })
  }

  mapIsLoaded() {
    this.baseMap$.subscribe((basemap: BaseMap) => {
      const { overlays, baselayers } = basemap
      this.overlays = overlays
      this.baselayers = baselayers
    })
  }

  onToggleTemplate() {
    this.imageInBig = !this.imageInBig
  }

  onToggleImageToDisplay() {
    this.imageFront = !this.imageFront
  }

  onToggleMinimize() {
    this.minimize = !this.minimize
  }

  getNearestPoint(position: GeoJSON.Position) {
    this.service.getImageByLngLat(position).subscribe((picturePoint: PicturePoint) => {
      this.point = picturePoint.geom
      this.pictures = picturePoint.pictures
      this.pictureLength = picturePoint.pictures.length
      // re open the small container when a new point is loaded
      // if (this.minimize && this.pictures) {
      //   this.minimize = false
      // }
    })
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}
