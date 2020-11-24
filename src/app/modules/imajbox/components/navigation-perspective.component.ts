import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Store } from '@ngxs/store'
import { ID } from 'app/shared/models'
import { Picture, PicturePoint } from '../../../shared/models/maps.model'
import { NeighboursDirectionType } from './../../../shared/models/maps.model'
import { GoToNeighbour } from './../store/pictures/pictures.action'

@Component({
  selector: 'app-navigation-perspective',
  template: `
    <div class="wrapper-direction relative">
      <button
        *ngIf="isFrontLeft"
        class="direction absolute direction-top-5 direction-left-5"
        (click)="onClick('front_left')"
      >
        <img [src]="'/assets/icons/direction-turn.svg'" class="front-left" />
      </button>
      <button
        *ngIf="isFrontRight"
        class="direction absolute direction-top-5 direction-right-5"
        (click)="onClick('front_right')"
      >
        <img [src]="'/assets/icons/direction-turn.svg'" class="front-right" />
      </button>
      <button
        *ngIf="isBackLeft"
        class="direction absolute direction-bottom-5 direction-left-5"
        (click)="onClick('back_left')"
      >
        <img [src]="'/assets/icons/direction-turn-back.svg'" class="back-left" />
      </button>
      <button
        *ngIf="isBackRight"
        class="direction absolute direction-bottom-5 direction-right-5"
        (click)="onClick('back_right')"
      >
        <img [src]="'/assets/icons/direction-turn-back.svg'" class="back-right" />
      </button>
      <button *ngIf="isFront" class="direction absolute top-0 direction-left-50" (click)="onClick('front')">
        <img [src]="'/assets/icons/direction.svg'" class="front" />
      </button>
      <button *ngIf="isBack" class="direction absolute bottom-0 direction-left-50" (click)="onClick('back')">
        <img [src]="'/assets/icons/direction.svg'" class="back" />
      </button>
    </div>
  `,
  styles: [
    `
      .wrapper-direction {
        background: transparent;
        height: 200px;
        width: 300px;
        transform: perspective(500px) rotateX(50deg);
      }

      .direction {
        height: 70px;
        width: 70px;
        background: transparent;
        border-radius: 50%;
        cursor: pointer;
        padding: 5px;
      }

      .direction:hover {
        background: #11afb6;
        opacity: 0.5;
      }

      .direction:active {
        opacity: 0.75;
      }

      .direction-left-50 {
        left: calc(50% - 35px);
      }

      .direction-bottom-5 {
        bottom: 5px;
      }

      .direction-top-5 {
        top: 5px;
      }

      .direction-left-5 {
        left: 5px;
      }

      .direction-right-5 {
        right: 5px;
      }

      .front {
        transform: scale(0.9);
        fill: #ffffff !important;
        filter: drop-shadow(0px 8px 5px rgba(0, 0, 0, 0.75));
      }

      .front-left {
        transform: scale(0.7);
        fill: #ffffff !important;
        filter: drop-shadow(0px 8px 5px rgba(0, 0, 0, 0.75));
      }

      .front-right {
        transform: scaleX(-1) scale(0.7);
        fill: #ffffff !important;
        filter: drop-shadow(0px 8px 5px rgba(0, 0, 0, 0.75));
      }

      .back {
        transform: rotate(180deg) translateY(-25%);
        fill: #ffffff !important;
        filter: drop-shadow(0px -8px 5px rgba(0, 0, 0, 0.75));
      }

      .back-left {
        transform: scale(0.95) rotate(20deg);
        fill: #ffffff !important;
        filter: drop-shadow(0px 8px 5px rgba(0, 0, 0, 0.75));
      }

      .back-right {
        transform: scaleX(-1) scale(0.95) rotate(20deg);
        fill: #ffffff !important;
        filter: drop-shadow(0px 8px 5px rgba(0, 0, 0, 0.75));
      }
    `,
  ],
})
export class NavigationPerspectiveComponent implements OnChanges {
  @Input() picturePoint: PicturePoint
  @Input() picture: Picture

  previousDirection: number
  previousAction: NeighboursDirectionType

  isFront = false
  isBack = false
  isFrontRight = false
  isFrontLeft = false
  isBackRight = false
  isBackLeft = false

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'picturePoint':
            if (this.picturePoint) {
              this.addDirectionIcon(this.picturePoint.neighbours)
            }
            break
        }
      }
    }
  }

  onClick(direction: NeighboursDirectionType) {
    this.goToNeighbour(direction)
  }

  private goToNeighbour(direction: NeighboursDirectionType) {
    if (this.picture) {
      this.store.dispatch(
        new GoToNeighbour(
          this.picture.camera === 'back' || this.picture.camera === 'back-right' || this.picture.camera === 'back-left'
            ? this.adaptDirection(direction)
            : direction
        )
      )
    }
  }

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

  private addDirectionIcon(neighbours: { [id: string]: ID }) {
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
    this.goToNeighbour('front')
  }

  @HostListener('document:keydown.arrowdown')
  arrowDown() {
    this.goToNeighbour('back')
  }

  @HostListener('document:keydown.arrowright')
  arrowRight() {
    if (this.isFrontRight) {
      this.goToNeighbour('front_right')
    } else {
      if (this.isBackRight) {
        this.goToNeighbour('back_right')
      }
    }
  }

  @HostListener('document:keydown.arrowleft')
  arrowLeft() {
    if (this.isFrontLeft) {
      this.goToNeighbour('front_left')
    } else {
      if (this.isBackLeft) {
        this.goToNeighbour('back_left')
      }
    }
  }
}
