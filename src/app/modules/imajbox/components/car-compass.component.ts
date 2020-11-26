import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { CameraPositionType, Picture } from './../../../shared/models/'

@Component({
  selector: 'app-car-compass',
  template: `
    <svg
      width="731"
      height="786"
      viewBox="0 0 731 786"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-28 w-28"
      *ngIf="pictures"
    >
      <g filter="url(#filter0_b)" *ngIf="isFront" (click)="onClickCamera('front')">
        <path
          d="M355.608 6C360.226 -1.99999 371.774 -2 376.392 6L424.89 90C429.509 98 423.735 108 414.497 108H317.503C308.265 108 302.491 98 307.11 90L355.608 6Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'front', active: selected === 'front' }"
        />
        <path
          d="M375.526 6.5L424.024 90.5C428.258 97.8333 422.965 107 414.497 107H317.503C309.035 107 303.742 97.8333 307.976 90.5L356.474 6.5C360.708 -0.833329 371.292 -0.833334 375.526 6.5Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter1_b)" *ngIf="isFrontLeft" (click)="onClickCamera('front-left')">
        <path
          d="M87.5217 124.219C85.1309 115.296 93.2958 107.131 102.219 109.522L195.908 134.626C204.831 137.017 207.82 148.17 201.288 154.702L132.702 223.288C126.17 229.82 115.017 226.831 112.626 217.908L87.5217 124.219Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'front-left', active: selected === 'front-left' }"
        />
        <path
          d="M101.96 110.488L195.65 135.592C203.829 137.783 206.568 148.007 200.581 153.995L131.995 222.581C126.007 228.568 115.783 225.829 113.592 217.65L88.4877 123.96C86.296 115.78 93.7806 108.296 101.96 110.488Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter2_b)" *ngIf="isLeft" (click)="onClickCamera('left')">
        <path
          d="M6 386.392C-1.99999 381.774 -2 370.226 6 365.608L90 317.11C98 312.491 108 318.265 108 327.503L108 424.497C108 433.735 98 439.509 90 434.89L6 386.392Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'left', active: selected === 'left' }"
        />
        <path
          d="M6.5 366.474L90.5 317.976C97.8333 313.742 107 319.035 107 327.503L107 424.497C107 432.965 97.8333 438.258 90.5 434.024L6.5 385.526C-0.833329 381.292 -0.833334 370.708 6.5 366.474Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter3_b)" *ngIf="isRight" (click)="onClickCamera('right')">
        <path
          d="M725 365.608C733 370.226 733 381.774 725 386.392L641 434.89C633 439.509 623 433.735 623 424.497V327.503C623 318.265 633 312.491 641 317.11L725 365.608Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'right', active: selected === 'right' }"
        />
        <path
          d="M724.5 385.526L640.5 434.024C633.167 438.258 624 432.965 624 424.497V327.503C624 319.035 633.167 313.742 640.5 317.976L724.5 366.474C731.833 370.708 731.833 381.292 724.5 385.526Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter4_b)" *ngIf="isFrontRight" (click)="onClickCamera('front-right')">
        <path
          d="M629.203 109.522C638.125 107.131 646.29 115.296 643.9 124.219L618.795 217.908C616.405 226.831 605.251 229.82 598.719 223.288L530.133 154.702C523.601 148.17 526.59 137.017 535.513 134.626L629.203 109.522Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'front-right', active: selected === 'front-right' }"
        />
        <path
          d="M642.934 123.96L617.83 217.65C615.638 225.829 605.414 228.568 599.426 222.581L530.84 153.995C524.853 148.007 527.592 137.783 535.772 135.592L629.461 110.488C637.641 108.296 645.125 115.78 642.934 123.96Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter5_b)" *ngIf="isBack" (click)="onClickCamera('back')">
        <path
          d="M353.608 779.421C358.226 787.421 369.774 787.421 374.392 779.421L422.89 695.421C427.509 687.421 421.735 677.421 412.497 677.421H315.503C306.265 677.421 300.491 687.421 305.11 695.421L353.608 779.421Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'back', active: selected === 'back' }"
        />
        <path
          d="M373.526 778.921L422.024 694.921C426.258 687.588 420.965 678.421 412.497 678.421H315.503C307.035 678.421 301.742 687.588 305.976 694.921L354.474 778.921C358.708 786.255 369.292 786.255 373.526 778.921Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter6_b)" *ngIf="isBackLeft" (click)="onClickCamera('back-left')">
        <path
          d="M86.5217 661.203C84.1309 670.126 92.2958 678.291 101.219 675.9L194.908 650.796C203.831 648.405 206.82 637.251 200.288 630.719L131.702 562.134C125.17 555.602 114.017 558.59 111.626 567.513L86.5217 661.203Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'back-left', active: selected === 'back-left' }"
        />
        <path
          d="M100.96 674.934L194.65 649.83C202.829 647.638 205.568 637.414 199.581 631.426L130.995 562.841C125.007 556.853 114.783 559.593 112.592 567.772L87.4877 661.462C85.296 669.641 92.7806 677.125 100.96 674.934Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <g filter="url(#filter7_b)" *ngIf="isBackRight" (click)="onClickCamera('back-right')">
        <path
          d="M628.203 675.9C637.125 678.291 645.29 670.126 642.9 661.203L617.795 567.513C615.405 558.59 604.251 555.602 597.719 562.134L529.133 630.719C522.601 637.251 525.59 648.405 534.513 650.796L628.203 675.9Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'back-right', active: selected === 'back-right' }"
        />
        <path
          d="M641.934 661.462L616.83 567.772C614.638 559.593 604.414 556.853 598.426 562.841L529.84 631.426C523.853 637.414 526.592 647.638 534.772 649.83L628.461 674.934C636.641 677.125 644.125 669.641 641.934 661.462Z"
          stroke="#4B4B4B"
          stroke-width="2"
        />
      </g>
      <path
        [matTooltip]="'imajbox.car' | transloco"
        class="car"
        matTooltipPosition="above"
        d="M313.972 189.5H416.02C429.348 189.5 441.458 196.914 450.256 207.733C459.054 218.553 464.491 232.723 464.5 246.116V548.039C464.5 574.802 442.785 596.5 416.02 596.5H313.972C287.198 596.5 265.5 574.794 265.5 548.039V246.116C265.5 232.722 270.933 218.553 279.73 207.733C288.527 196.914 300.639 189.5 313.972 189.5ZM456.917 409.755V333.94C456.917 328.938 449.98 327.669 448.209 332.346L432.526 373.765C432.333 374.274 432.234 374.814 432.234 375.358V411.771C432.234 414.484 434.617 416.58 437.308 416.234L452.991 414.218C455.236 413.929 456.917 412.018 456.917 409.755ZM425.993 353.431C428.459 343.983 436.373 313.659 443.522 286.232C444.123 283.925 442.807 281.538 440.521 280.841C372.867 260.21 308.679 275.4 290.754 280.482C289.335 280.885 288.17 281.986 287.452 283.291C286.733 284.597 286.422 286.175 286.792 287.592L303.985 353.416C304.503 355.397 306.292 356.779 308.339 356.779H421.643C423.688 356.779 425.475 355.414 425.993 353.431ZM298.026 411.783V378.091C298.026 377.547 297.927 377.007 297.735 376.497L282.043 335.065C280.271 330.388 273.335 331.658 273.335 336.659V409.778C273.335 412.043 275.018 413.955 277.264 414.242L292.956 416.247C295.646 416.591 298.026 414.495 298.026 411.783ZM273.335 432.78V510.638C273.335 514.231 277.339 516.375 280.33 514.382L296.022 503.925C297.274 503.091 298.026 501.685 298.026 500.18V434.751C298.026 432.482 296.338 430.569 294.087 430.286L278.395 428.315C275.709 427.978 273.335 430.072 273.335 432.78ZM304.992 516.217L291.064 537.157C289.075 540.148 291.219 544.149 294.811 544.149H437.895C441.487 544.149 443.631 540.147 441.641 537.156L427.707 516.217C426.873 514.963 425.467 514.21 423.961 514.21H308.739C307.232 514.21 305.826 514.963 304.992 516.217ZM432.234 434.831V497.466C432.234 498.971 432.986 500.375 434.237 501.21L449.92 511.671C452.911 513.665 456.917 511.522 456.917 507.927V432.791C456.917 430.076 454.53 427.979 451.837 428.329L436.154 430.368C433.912 430.66 432.234 432.57 432.234 434.831Z"
        fill="#E2F5F6"
        stroke="#4B4B4B"
      />
      <defs>
        <filter
          id="filter0_b"
          x="301.485"
          y="-4"
          width="129.031"
          height="116"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter1_b"
          x="43.8369"
          y="65.8366"
          width="169.949"
          height="169.949"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter2_b"
          x="-4"
          y="311.485"
          width="116"
          height="129.031"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter3_b"
          x="619"
          y="311.485"
          width="116"
          height="129.031"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter4_b"
          x="517.635"
          y="65.8366"
          width="169.949"
          height="169.949"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter5_b"
          x="299.485"
          y="673.421"
          width="129.031"
          height="116"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter6_b"
          x="42.8369"
          y="549.636"
          width="169.949"
          height="169.949"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter7_b"
          x="516.635"
          y="549.636"
          width="169.949"
          height="169.949"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
      </defs>
    </svg>
  `,
  styles: [
    `
      .active {
        fill: #58c7cc !important;
        cursor: not-allowed;
      }

      .inactive {
        fill: #ffffff !important;
        cursor: pointer;
      }

      .car {
        fill: #ffffff !important;
        cursor: help;
      }
    `,
  ],
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

  constructor() {}

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
