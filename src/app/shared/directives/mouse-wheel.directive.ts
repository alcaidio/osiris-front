import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[appMouseWheel]'
})
export class MouseWheelDirective {

  scale = 1
  // TODO add translate to zoom on cursor : https://jsfiddle.net/oepyf6hL/
  // position = { x: -100, y: -200 }
  // this.el.nativeElement.style.setProperty('transform', `scale(${this.scale}) translate(${-this.position.x}px, ${-this.position.y}px)`)

  constructor(private el: ElementRef) {}

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.mouseWheelFunc(event, 5, 0.2)
  }

  mouseWheelFunc(event: any, maxScale: number, step: number) {
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))

    
    if (delta > 0) {
      if (this.scale < (maxScale + step)) {
        this.scale += step
        this.el.nativeElement.style.setProperty('transform', `scale(${this.scale})`)
      } else {
        this.scale = maxScale
      }
    } else if (delta < 0) {
      if (this.scale > (1 + step)) {
        this.scale -= step
        this.el.nativeElement.style.setProperty('transform', `scale(${this.scale})`)
      } else {
        this.scale = 1
      }
    }
    if (event.preventDefault) {
        event.preventDefault()
    }
  }
}
