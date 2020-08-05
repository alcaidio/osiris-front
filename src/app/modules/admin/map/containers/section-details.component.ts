import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDrawerToggleResult } from '@angular/material/sidenav'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { DiagService } from '../services/diag.service'
import { Section } from './../models/section.model'
import { CustomMapComponent } from './map.component'

@Component({
  selector: 'app-section-details',
  template: `
    <div class="content-layout fullwidth-basic-inner-scroll">
      <!-- Main -->
      <div class="main p-4">
        <div *ngIf="section">
          {{ section | json }}
        </div>
      </div>
    </div>
  `,
})
export class SectionDetailsComponent implements OnInit, OnDestroy {
  section: Section
  private subs = new Subscription()

  constructor(
    private route: ActivatedRoute,
    private mapComponent: CustomMapComponent,
    private diagService: DiagService
  ) {}

  ngOnInit(): void {
    this.openDrawer()
    this.subs.add(
      this.route.params.subscribe((params) => {
        this.subs.add(
          this.diagService.getSectionById(params.id).subscribe((s: Section) => {
            this.section = s
            this.flyToSection(s)
            setTimeout(() => this.displaySelectedSection(s), 150)
          })
        )
      })
    )
  }

  private flyToSection(section: Section): void {
    const map = this.mapComponent.map.mapInstance
    const { sw, ne } = section.bounds
    map.fitBounds([sw, ne], { padding: 200 })
  }

  private displaySelectedSection(section: Section): void {
    const map = this.mapComponent.map.mapInstance
    const id = 'selectedSection'

    if (map.getLayer(id) && map.getSource(id)) {
      map.removeLayer(id)
      map.removeSource(id)
    }

    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: section.geometry.coordinates,
            },
          },
        ],
      },
    })

    map.addLayer({
      id: id,
      source: id,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#888',
        'line-width': 12,
        'line-blur': 3,
        'line-opacity': 0.75,
      },
    })
  }

  // Use in section resolver
  public closeDrawer(): Promise<MatDrawerToggleResult> {
    return this.mapComponent.matDrawer.close()
  }

  private openDrawer(): Promise<MatDrawerToggleResult> {
    return this.mapComponent.matDrawer.open()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
