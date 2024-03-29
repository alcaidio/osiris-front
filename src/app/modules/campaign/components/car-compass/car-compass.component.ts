import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { NotificationService } from 'app/shared/services/notification.service'
import { CameraPositionType, Picture } from '../../model/campaign.model'

@Component({
  selector: 'app-car-compass',
  templateUrl: './car-compass.component.html',
  styleUrls: ['./car-compass.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarCompassComponent implements OnChanges {
  @Input() pictures: Picture[]
  @Input() selected: CameraPositionType
  @Output() camera = new EventEmitter<CameraPositionType>()

  isFront = false
  isBack = false
  isRight = false
  isLeft = false
  isFrontRight = false
  isFrontLeft = false
  isBackRight = false
  isBackLeft = false

  constructor(private notification: NotificationService) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'pictures':
            if (this.pictures) {
              this.pictures.map((picture) => {
                this.defineCameraPosition(picture)
              })
            }
            break
        }
      }
    }
  }

  onClickCamera(type: CameraPositionType) {
    if (this.selected !== type) {
      this.camera.emit(type)
    } else {
      this.notification.openSnackBar(`Vous êtes déjà sur la caméra ${this.selected}`, 'X', 2000)
    }
  }

  private defineCameraPosition(picture: Picture) {
    switch (picture.camera) {
      case 'front':
        this.isFront = true
        break
      case 'back':
        this.isBack = true
        break
      case 'right':
        this.isRight = true
        break
      case 'left':
        this.isLeft = true
        break
      case 'front-right':
        this.isFrontRight = true
        break
      case 'front-left':
        this.isFrontLeft = true
        break
      case 'back-right':
        this.isBackRight = true
        break
      case 'back-left':
        this.isBackLeft = true
        break
      default:
        console.warn(`No Image available for ${picture}`)
    }
  }

  @HostListener('document:keydown.alt.arrowup')
  cameraFront() {
    this.onClickCamera('front')
  }

  @HostListener('document:keydown.alt.arrowdown')
  cameraBack() {
    this.onClickCamera('back')
  }

  @HostListener('document:keydown.alt.arrowright')
  cameraRight() {
    this.onClickCamera('right')
  }

  @HostListener('document:keydown.alt.arrowleft')
  cameraLeft() {
    this.onClickCamera('left')
  }
}
