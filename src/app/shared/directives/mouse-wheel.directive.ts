import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[appMouseWheel]',
})
export class MouseWheelDirective {
  // TODO add translate to zoom on cursor : https://jsfiddle.net/oepyf6hL/
  // position = { x: 0, y: 0 }
  // target = { x: 0, y: 0 }
  scale = 1

  constructor(private el: ElementRef) {}

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.mouseWheelFunc(event, 5, 0.2)
  }

  private update() {
    this.el.nativeElement.style.setProperty('transform', `scale(${this.scale}) `)
  }

  private mouseWheelFunc(event: any, maxScale: number, step: number) {
    const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail))
    const { layerX, layerY } = event

    if (delta > 0) {
      // zoom
      if (this.scale < maxScale - step) {
        this.scale += step
        this.update()
      } else {
        this.scale = maxScale
      }
    } else {
      // dezoom
      if (this.scale > 1) {
        this.scale -= step
        this.update()
      } else {
        this.scale = 1
      }
    }
    if (event.preventDefault) {
      event.preventDefault()
    }
  }
}
