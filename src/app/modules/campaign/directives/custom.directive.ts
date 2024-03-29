import { Directive, OnInit } from '@angular/core'
import { LeafletDirective } from '@asymmetrik/ngx-leaflet'
import { Control, DomUtil, Map } from 'leaflet'

@Directive({
  selector: '[appCustomLeafletDirective]',
})
export class CustomLeafletDirective implements OnInit {
  constructor(leafletDirective: LeafletDirective) {
    this.leafletDirective = leafletDirective
  }
  leafletDirective: LeafletDirective
  map: Map

  ngOnInit(): void {
    this.map = this.leafletDirective.getMap()
    this.init()
  }

  init() {
    if (!!this.map) {
      // add zoom control
      // this.map.addControl(control.zoom({ position: 'bottomright' }))

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
