import { Directive, OnInit } from '@angular/core'
import { LeafletDirective } from '@asymmetrik/ngx-leaflet'
import { Control, DomUtil, Map } from 'leaflet'

@Directive({
  selector: '[appCustomLeafletDirective]',
})
export class CustomDirective implements OnInit {
  leafletDirective: LeafletDirective
  map: Map

  constructor(leafletDirective: LeafletDirective) {
    this.leafletDirective = leafletDirective
  }

  ngOnInit(): void {
    this.map = this.leafletDirective.getMap()
    this.init()
  }

  init() {
    if (!!this.map) {
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
