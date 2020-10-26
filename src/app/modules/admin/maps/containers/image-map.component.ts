import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Picture, PicturePoint } from './../models/maps.model'
import { PictureService } from './../services/picture.service'

@AutoUnsubscribe()
@Component({
  selector: 'app-image-map',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/maps.component.scss'],
  template: `
  <div class="content-layout fullwidth-basic-content-scroll">
    <div class="flex p-8 wrapper">
      <div class="w-1/4 flex flex-col">
        <div class="flex mb-4">
          <button mat-raised-button color="accent" (click)="onToggleTemplate()" class="flex-1 mr-1">
            <mat-icon *ngIf="!imageInBig">fullscreen</mat-icon>
            <mat-icon *ngIf="imageInBig">fullscreen_exit</mat-icon>
          </button>
          <button mat-raised-button color="accent" (click)="onToggleImageToDisplay()" class="flex-1 ml-1">
            <mat-icon>switch_camera</mat-icon>
          </button>
        </div>
        <app-map-image [point]="point" (position)="getNearestPoint($event)" class="card h-full" *ngIf="imageInBig"></app-map-image>
        <treo-card class="flex flex-col w-full" *ngIf="!imageInBig">
            <img *ngIf="!imageError && pictures" class="object-cover" [src]="currentImagePath" (error)="onImageLoadError()">
            <img *ngIf="imageError" class="object-cover" src="assets/images/pages/maps/broken-image.png">
            <img *ngIf="!pictures && !imageError" class="object-cover" src="assets/images/pages/maps/image-unvailable.png">
        </treo-card>
      </div>
      <div class="w-3/4 ml-6">
        <div class="card image-limit cursor-image" *ngIf="imageInBig" >
          <!-- FIX : error image and cache last image clicked - remove this lib  -->
          <lib-ngx-image-zoom
              *ngIf="pictures && !imageError"
              [thumbImage]="currentImagePath"
              [enableScrollZoom]="true"
              [zoomMode]="'hover'"
          ></lib-ngx-image-zoom>
          <img *ngIf="imageError" class="object-cover" src="assets/images/pages/maps/broken-image.png">
          <img *ngIf="!pictures && !imageError" class="object-cover" src="assets/images/pages/maps/image-unvailable.png">
        </div>
        <div class="card h-full" *ngIf="!imageInBig">
          <app-map-image [point]="point" (position)="getNearestPoint($event)"></app-map-image>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ImageMapComponent implements OnInit, OnDestroy {
  pictures: Picture[]
  point: GeoJSON.Point
  imageFront = true
  imageInBig = false
  imageError = false 

  constructor(private service: PictureService) {}

  ngOnInit(): void {
  }

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

  getNearestPoint(position: GeoJSON.Position) {
    this.imageError = false
    this.service.getImageByLngLat(position).subscribe((picturePoint: PicturePoint) => {
      this.point = picturePoint.geom
      this.pictures = picturePoint.pictures
    })
  }

  get currentImagePath() {
    if (this.imageFront) {
      return this.pictures[0].path
    } else {
      return this.pictures[1].path
    }
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }

}
