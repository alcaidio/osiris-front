import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDrawerToggleResult } from '@angular/material/sidenav'
import { Select, Store } from '@ngxs/store'
import { ID } from 'app/shared/shared.model'
import { Observable, Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import { GetSectionById } from '../store'
import { Section } from './../models/section.model'
import { SectionsState } from './../store/states/section.state'
import { CustomMapComponent } from './map.component'

@Component({
  selector: 'app-section-details',
  template: `
    <div class="content-layout fullwidth-basic-inner-scroll">
      <!-- Main -->
      <div class="main p-4">
        <div *ngIf="selectedSection$ | async as section">
          {{ section | json }}
        </div>
      </div>
    </div>
  `,
})
export class SectionDetailsComponent implements OnInit, OnDestroy {
  @Select(SectionsState.getSelectedSection) selectedSection$: Observable<Section>
  @Select((state) => state.router.state.params.id) id$: Observable<ID>
  private subs = new Subscription()

  constructor(private mapComponent: CustomMapComponent, private store: Store) {}

  ngOnInit(): void {
    this.openDrawer()
    this.subs.add(
      this.id$.subscribe((id) => {
        this.subs.add(
          this.store
            .dispatch(new GetSectionById(id))
            .pipe(take(1))
            .subscribe((state) => {
              const sections = state.map.sections
              const selectedSection = sections.entities[sections.selectedSectionId]
              this.flyToSection(selectedSection)
              setTimeout(() => this.displaySelectedSection(selectedSection), 200)
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
