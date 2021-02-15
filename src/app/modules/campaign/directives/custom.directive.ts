import { Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { LeafletDirective } from '@asymmetrik/ngx-leaflet'
import { control, Control, DomUtil, LatLngBounds, Map } from 'leaflet'

@Directive({
  selector: '[appCustomLeafletDirective]',
})
export class CustomDirective implements OnInit {
  constructor(leafletDirective: LeafletDirective, private el: ElementRef) {
    this.leafletDirective = leafletDirective
  }
  leafletDirective: LeafletDirective
  map: Map

  firstPoint: any
  secondPoint: any
  isDrawing = false
  x = 0
  y = 0

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>

  ngOnInit(): void {
    this.map = this.leafletDirective.getMap()
    this.init()
  }

  init() {
    if (!!this.map) {
      // add zoom control
      this.map.addControl(control.zoom({ position: 'topright' }))

      this.map.on('boxzoomend', (e) => {
        console.log(e)
      })

      // this.addDiv()
    }
  }

  private addDiv() {
    const command = new Control()
    command.onAdd = () => {
      const div = DomUtil.create('div')
      div.innerHTML += '<div style="text-align:center;">CECI est une div</div>'
      return div
    }
    command.addTo(this.map)
  }

  // TODO add multiple selection https://stackoverflow.com/questions/17611596/multiple-marker-selection-within-a-box-in-leaflet

  
}
