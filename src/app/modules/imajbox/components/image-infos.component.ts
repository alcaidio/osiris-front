import { Component, Input } from '@angular/core'
import { Picture, PicturePoint } from './../../../shared/models/maps.model'

@Component({
  selector: 'app-image-infos',
  template: `
    <div
      class="min-width block px-4 p-2 text-sm font leading-5 text-white bg-gray-800 opacity-75 rounded hover:opacity-100 text-center"
      *ngIf="point && picture"
    >
      {{ 'Camera ' + (picture?.camera | titlecase) + ' &bull; ' + (point?.timestamp | date: 'medium') }}
    </div>
  `,
  styles: [
    `
      .min-width {
        min-width: 270px;
      }
    `,
  ],
})
export class ImageInfosComponent {
  @Input() point: PicturePoint
  @Input() picture: Picture
}
