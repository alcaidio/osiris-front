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
    <mat-list role="list" *ngIf="(selectedSection$ | async)?.properties as section">
      {{ section | json }}
    </mat-list>
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
    const { sw, ne } = section.bbox
    // padding right depend of the drawer size (375px)
    map.fitBounds([sw, ne], { padding: { top: 200, bottom: 200, left: 200, right: 550 } })
  }

  private displaySelectedSection(section: Section): void {
    const map = this.mapComponent.map.mapInstance
    const id = 'selectedSection'

    this.removeSourceAndLayer('selectedSection')

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
        // TODO put color of the selected layer
        'line-color': '#1aae61',
        'line-width': 20,
        'line-blur': 2,
        'line-opacity': 0.6,
      },
    })
  }

  private removeSourceAndLayer(id: string): void {
    const map = this.mapComponent.map.mapInstance
    if (map.getLayer(id) && map.getSource(id)) {
      map.removeLayer(id)
      map.removeSource(id)
    }
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
    this.removeSourceAndLayer('selectedSection')
    this.closeDrawer()
  }
}
