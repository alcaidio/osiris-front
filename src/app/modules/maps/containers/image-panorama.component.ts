import { Component } from '@angular/core'
import { convertDegreesToRadians } from './../services/marzipano.service'

@Component({
  selector: 'app-image-panorama',
  template: `
  <app-viewer-template [minimize]="minimize">
    <!-- Background  -->
    <ng-container foreground>
        <app-map-image [point]="point" (position)="getNearestPoint($event)"></app-map-image>
    </ng-container>

    <!-- Foreground  -->
    <ng-container background>
        <app-viewer [image]='image' [config]="config"></app-viewer>
    </ng-container>

    <!-- Fab  -->
    // TODO

  </app-viewer-template>
  `
})
export class ImagePanoramaComponent {
  minimize = false
  point: GeoJSON.Point

  // mock 
  image = 'http://192.168.0.147/pcrs/MdL/Photos_360/2019-12-31/stream_00007-000000_10851_0053305.jpg'
  config = { yaw: 0, pitch: 0, fov: convertDegreesToRadians(65) }

  constructor() { }

  getNearestPoint(position: GeoJSON.Position) {
    // this.service.getImageByLngLat(position).subscribe((picturePoint: PicturePoint) => {
    //   this.point = picturePoint.geom
    //   this.pictures = picturePoint.pictures
    // })
  }

}
