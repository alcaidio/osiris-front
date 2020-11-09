import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { Picture } from '../../../shared/models/maps.model'

@Component({
  selector: 'app-flat-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="zoom">
      <img
        *ngIf="!error && picture"
        appMouseWheel
        class="object-cover object-bottom-bis h-full w-full"
        [src]="picture.path"
        (error)="onError()"
        (load)="onLoaded()"
      />
    </ng-container>
    <ng-container *ngIf="!zoom">
      <img
        *ngIf="!error && picture"
        class="object-cover object-bottom-bis h-full w-full"
        [src]="picture.path"
        (error)="onError()"
        (load)="onLoaded()"
      />
    </ng-container>

    <img *ngIf="error" class="object-cover h-full w-full" src="assets/images/pages/maps/broken-image.png" />
    <img
      *ngIf="!picture && !error"
      class="object-cover h-full w-full"
      src="assets/images/pages/maps/image-unvailable.png"
    />
  `,
  styles: [],
})
export class FlatImageComponent implements OnChanges {
  @Input() picture: Picture
  @Input() zoom = false
  @Output() cameraTooltipMessage = new EventEmitter<string>()
  error = false

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'picture':
            this.error = false
            break
        }
      }
    }
  }

  onError() {
    this.error = true
  }

  onLoaded() {
    if (this.picture.camera === 'front') {
      this.cameraTooltipMessage.emit('Charger la vue arrière')
    } else {
      this.cameraTooltipMessage.emit('Charger la vue avant')
    }
  }
}
