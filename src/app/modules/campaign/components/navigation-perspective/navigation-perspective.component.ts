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
import { CameraPositionType, NeighboursDirectionType, Picture, PicturePoint } from '../../model/campaign.model'

@Component({
  selector: 'app-navigation-perspective',
  templateUrl: './navigation-perspective.component.html',
  styleUrls: ['./navigation-perspective.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationPerspectiveComponent implements OnChanges {
  @Input() picturePoint: PicturePoint
  @Input() picture: Picture
  @Output() direction = new EventEmitter<NeighboursDirectionType>()
  @Output() camera = new EventEmitter<CameraPositionType>()

  isFront = false
  isBack = false
  isFrontRight = false
  isFrontLeft = false
  isBackRight = false
  isBackLeft = false

  constructor(private notification: NotificationService) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'picturePoint':
          case 'picture':
            if (this.picturePoint) {
              this.addDirectionIcons(this.picturePoint.neighbours)
            }
            break
        }
      }
    }
  }

  onClick(direction: NeighboursDirectionType) {
    this.picture.camera === 'back' || this.picture.camera === 'back-right' || this.picture.camera === 'back-left'
      ? this.direction.emit(this.adaptDirection(direction))
      : this.direction.emit(direction)
  }

  // Permet d'adapter les flèches de navigation en fonction de la position de caméra active
  private adaptDirection(direction: NeighboursDirectionType): NeighboursDirectionType {
    switch (direction) {
      case 'back':
        return 'front'
      case 'front':
        return 'back'
      case 'front_right':
        return 'back_left'
      case 'front_left':
        return 'back_right'
      case 'back_right':
        return 'front_left'
      case 'back_left':
        return 'front_right'
    }
  }

  private addDirectionIcons(neighbours: { [id: string]: string | number }) {
    if (this.picture && this.picture.camera === 'back') {
      if (neighbours['back']) {
        this.isFront = true
      } else {
        this.isFront = false
      }
      if (neighbours['front']) {
        this.isBack = true
      } else {
        this.isBack = false
      }
      if (neighbours['front_right']) {
        this.isBackLeft = true
      } else {
        this.isBackLeft = false
      }
      if (neighbours['front_left']) {
        this.isBackRight = true
      } else {
        this.isBackRight = false
      }
      if (neighbours['back_right']) {
        this.isFrontLeft = true
      } else {
        this.isFrontLeft = false
      }
      if (neighbours['back_left']) {
        this.isFrontRight = true
      } else {
        this.isFrontRight = false
      }
    } else {
      if (neighbours['front']) {
        this.isFront = true
      } else {
        this.isFront = false
      }
      if (neighbours['back']) {
        this.isBack = true
      } else {
        this.isBack = false
      }
      if (neighbours['front_right']) {
        this.isFrontRight = true
      } else {
        this.isFrontRight = false
      }
      if (neighbours['front_left']) {
        this.isFrontLeft = true
      } else {
        this.isFrontLeft = false
      }
      if (neighbours['back_right']) {
        this.isBackRight = true
      } else {
        this.isBackRight = false
      }
      if (neighbours['back_left']) {
        this.isBackLeft = true
      } else {
        this.isBackLeft = false
      }
    }
  }

  @HostListener('document:keydown.arrowup')
  arrowUp() {
    if (this.isFront) {
      this.onClick('front')
    } else {
      this.notification.openSnackBar('Vous ne pouvez pas aller devant', 'X', 2000)
    }
  }

  @HostListener('document:keydown.arrowdown')
  arrowDown() {
    if (this.isBack) {
      this.onClick('back')
    } else {
      this.notification.openSnackBar('Vous ne pouvez pas aller derrière', 'X', 2000)
    }
  }

  @HostListener('document:keydown.arrowright')
  arrowRight() {
    if (this.isFrontRight) {
      this.onClick('front_right')
    } else {
      if (this.isBackRight) {
        this.onClick('back_right')
      } else {
        this.notification.openSnackBar('Vous ne pouvez pas aller sur les côtés', 'X', 2000)
      }
    }
  }

  @HostListener('document:keydown.arrowleft')
  arrowLeft() {
    if (this.isFrontLeft) {
      this.onClick('front_left')
    } else {
      if (this.isBackLeft) {
        this.onClick('back_left')
      } else {
        this.notification.openSnackBar('Vous ne pouvez pas aller sur les côtés', 'X', 2000)
      }
    }
  }
}
