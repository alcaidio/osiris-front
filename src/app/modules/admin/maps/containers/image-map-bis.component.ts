import { Component, OnDestroy, ViewEncapsulation } from '@angular/core'
import { Picture, PicturePoint } from '../models/maps.model'
import { PictureService } from '../services/picture.service'

@Component({
  selector: 'app-image-map-bis',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/maps.component.scss'],
  template: `
    <div class="content-layout fullwidth-basic-content-scroll">
      <div class="wrapper">
        <div class="background">
            <div id="in-back" *ngIf="!imageInBig">
              <app-map-image [point]="point" (position)="getNearestPoint($event)"></app-map-image>
            </div>
            <div appMouseWheel id="in-back" *ngIf="imageInBig">
              <img *ngIf="!imageError && pictures" class="object-cover object-bottom-bis h-full w-full" [src]="currentImagePath" (error)="onImageLoadError()">
              <img *ngIf="imageError" class="object-cover h-full w-full" src="assets/images/pages/maps/broken-image.png">
              <img *ngIf="!pictures && !imageError" class="object-cover h-full w-full" src="assets/images/pages/maps/image-unvailable.png">
            </div>
          </div>
        <div class="foreground">
          <div id="in-front" class="relative" *ngIf="!minimize">
            <ng-container *ngIf="imageInBig">
              <app-map-image [point]="point" (position)="getNearestPoint($event)"></app-map-image>
            </ng-container>
            <ng-container *ngIf="!imageInBig">
              <img *ngIf="!imageError && pictures" class="object-cover object-bottom-bis h-full w-full" [src]="currentImagePath" (error)="onImageLoadError()">
              <img *ngIf="imageError" class="object-cover h-full w-full" src="assets/images/pages/maps/broken-image.png">
              <img *ngIf="!pictures && !imageError" class="object-cover h-full w-full" src="assets/images/pages/maps/image-unvailable.png">
            </ng-container>
            <div class="absolute right-0 bottom-0" (click)="onToggleTemplate()" [matTooltip]="'Etendre'" matTooltipPosition="below">
                <div class="triangle relative"></div>
                <span class="material-icons absolute right-0 bottom-0 p-1 z-40 cursor-pointer">south_east</span>
              </div>
              <div class="absolute left-0 top-0">
                <button mat-icon-button color="primary" (click)="onToggleMinimize()" [matTooltip]="'Réduire'" matTooltipPosition="after">
                  <mat-icon class="icon-size-16">close</mat-icon>
                </button>
              </div>
              <div class="absolute right-0 top-0">
                <button mat-icon-button color="primary" (click)="onToggleImageToDisplay()" [matTooltip]="cameraTooltipMessage" matTooltipPosition="after">
                  <mat-icon class="icon-size-16">switch_camera</mat-icon>
                </button>
              </div>
          </div>
          <div *ngIf="minimize">
            <button *ngIf="!imageInBig" mat-fab color="accent" (click)="onToggleMinimize()" [matTooltip]="'Ouvrir les images'" matTooltipPosition="after" class="relative">
              <mat-icon>camera_alt</mat-icon>
              <span class=" absolute right-0 top-0 -mr-3 mt-2" [matBadge]="pictureLength" matBadgePosition="after" matBadgeColor="primary"></span>
            </button>
            <button *ngIf="imageInBig" mat-fab color="accent" (click)="onToggleMinimize()" [matTooltip]="'Ouvrir la carte'" matTooltipPosition="after">
              <mat-icon>map</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImageMapBisComponent implements OnDestroy {

  pictures: Picture[]
  point: GeoJSON.Point
  pictureLength: number
  cameraTooltipMessage = 'Charger la vue arrière'

  // UI
  minimize = true 
  imageFront = true
  imageInBig = false
  imageError = false 

  constructor(private service: PictureService) {}
  
  onToggleTemplate() {
    this.imageInBig = !this.imageInBig
  }

  onToggleImageToDisplay() {
    this.imageError = false
    this.imageFront = !this.imageFront
  }

  onImageLoadError() {
      this.imageError = true
  }

  onToggleMinimize() {
      this.minimize = !this.minimize
  }

  getNearestPoint(position: GeoJSON.Position) {
    this.imageError = false
    this.service.getImageByLngLat(position).subscribe((picturePoint: PicturePoint) => {
      this.point = picturePoint.geom
      this.pictures = picturePoint.pictures
      this.pictureLength = picturePoint.pictures.length      
      if (this.minimize && this.pictures) {
        this.minimize = false
      }
    })
  }

  get currentImagePath() {
    if (this.imageFront) {
      this.cameraTooltipMessage = 'Charger la vue arrière'
      return this.pictures[0].path
    } else {
      this.cameraTooltipMessage = 'Charger la vue avant'
      return this.pictures[1].path
    }
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}
