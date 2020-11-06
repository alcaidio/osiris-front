import { Component } from '@angular/core'
import { convertDegreesToRadians } from './utils/conversion.util'

@Component({
  selector: 'app-roadview',
  template: `
    <app-template-one [minimize]="minimize">
      <!-- Background  -->
      <ng-container foreground>
        <!-- TODO -->
        <!-- <app-mapbox [point]="point" (position)="getNearestPoint($event)"></app-mapbox> -->
      </ng-container>

      <!-- Foreground  -->
      <ng-container background>
        <app-panorama [image]="image" [config]="config"></app-panorama>
      </ng-container>

      <!-- Fab  -->
      // TODO
    </app-template-one>
  `,
})
export class RoadviewComponent {
  minimize = false
  point: GeoJSON.Point

  // mock
  image = 'http://192.168.0.147/pcrs/MdL/Photos_360/2019-12-31/stream_00007-000000_10851_0053305.jpg'
  config = { yaw: 0, pitch: 0, fov: convertDegreesToRadians(65) }

  constructor() {}

  getNearestPoint(position: GeoJSON.Position) {
    // this.service.getImageByLngLat(position).subscribe((picturePoint: PicturePoint) => {
    //   this.point = picturePoint.geom
    //   this.pictures = picturePoint.pictures
    // })
  }
}
