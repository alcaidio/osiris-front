import { Component, OnInit } from '@angular/core'
import { SECTIONS } from './sections'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  outSections = []
  goodSections = []
  mediumSections = []
  poorSections = []
  veryPoorSections = []

  constructor() {}

  ngOnInit(): void {
    this.generateLayers()
  }

  private generateLayers(): void {
    SECTIONS.features.map((t) => {
      const state = t.properties.etat_ch
      if (state === 'Bon') {
        return this.goodSections.push(t)
      } else if (state === 'Moyen') {
        return this.mediumSections.push(t)
      } else if (state === 'Mauvais') {
        return this.poorSections.push(t)
      } else if (state === 'Très mauvais') {
        return this.veryPoorSections.push(t)
      } else {
        return this.outSections.push(t)
      }
    })
  }
}
