import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { Picture } from './../models/maps.model'

@Component({
  selector: 'app-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="zoom">
      <img
        *ngIf="!error && pictures"
        appMouseWheel
        class="object-cover object-bottom-bis h-full w-full"
        [src]="currentImagePath"
        (error)="onError()"
        (load)="onLoaded()"
      />
    </ng-container>
    <ng-container *ngIf="!zoom">
      <img
        *ngIf="!error && pictures"
        class="object-cover object-bottom-bis h-full w-full"
        [src]="currentImagePath"
        (error)="onError()"
        (load)="onLoaded()"
      />
    </ng-container>

    <img *ngIf="error" class="object-cover h-full w-full" src="assets/images/pages/maps/broken-image.png" />
    <img
      *ngIf="!pictures && !error"
      class="object-cover h-full w-full"
      src="assets/images/pages/maps/image-unvailable.png"
    />
  `,
  styles: [],
})
export class ImageComponent implements OnChanges {
  @Input() pictures: Picture[]
  @Input() firstImage: boolean // TODO: just two image now so it's a boolean but maybe it will be a string if more than 2 images by points
  @Input() zoom = false

  @Output() cameraTooltipMessage = new EventEmitter<string>()
  error = false

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'pictures':
            this.error = false
            break
          case 'firstImage':
            this.error = false
        }
      }
    }
  }

  onError() {
    this.error = true
  }

  onLoaded() {
    if (this.firstImage) {
      this.cameraTooltipMessage.emit('Charger la vue arrière')
    } else {
      this.cameraTooltipMessage.emit('Charger la vue avant')
    }
  }

  get currentImagePath() {
    if (this.firstImage) {
      return this.pictures[0].path
    } else {
      return this.pictures[1].path
    }
  }
}
