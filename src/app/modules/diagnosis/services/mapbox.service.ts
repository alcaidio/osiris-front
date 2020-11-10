import { Injectable } from '@angular/core'
import { Map } from 'mapbox-gl'
import { Section } from '../models/section.model'

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  constructor() {}

  flyToSection(section: Section, mapInstance: Map, withoutNav = false): void {
    if (section && mapInstance) {
      mapInstance.fitBounds([section.bbox[0], section.bbox[1], section.bbox[2], section.bbox[3]], {
        padding: { top: 100, bottom: 100, left: 100, right: withoutNav ? 100 : 475 },
        maxDuration: 3000,
      })
    }
  }
}
