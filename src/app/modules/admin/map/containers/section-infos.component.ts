import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { ID } from 'app/shared/shared.model'
import { Observable, Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import { Section } from '../models/section.model'
import { CloseDrawer, GetSectionById, OpenDrawer } from '../store'
import { SectionsState } from '../store/states/section.state'
import { CustomMapComponent } from './map.component'

@Component({
  selector: 'app-section-infos',
  template: `
    <ng-container *ngIf="(selectedSection$ | async)?.properties as section">
      <div class="bg-gray-50 p-5 border-b border-gray-200">
        <div class="text-lg leading-6 font-medium text-gray-900">
          Informations du tronçon
        </div>
      </div>
      <div>
        <dl>
          <div class="px-4 py-3 mt-2">
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Cractéristiques
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md">
                <li class="pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Etat: </span>
                  {{ section.state ? (section.state | titlecase) : 'Inconnu' }}
                  <mat-icon
                    class="icon-size-12 text-gray cursor-pointer"
                    [svgIcon]="'dripicons:question'"
                    [matTooltipPosition]="'right'"
                    matTooltip="Good / Medium / Bad / Very bad"
                  ></mat-icon>
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <div class="flex">
                    <div class="flex-1">
                      <span class="font-medium mr-1">Longeur: </span>
                      {{ section.length ? section.length + ' m' : 'null' }}
                    </div>
                    <div class="flex-1">
                      <span class="font-medium mr-1">Largeur: </span>
                      {{ section.width ? section.width + ' m' : 'null' }}
                    </div>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
          <div class="px-4 py-3">
            <dt class="text-sm leading-5 font-medium mr-1 text-gray-500">
              Localisation
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md">
                <li class="pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Rue: </span>
                  {{ section.streetName ? (section.streetName | titlecase) : '-' }}
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Quartier: </span>
                  {{ section.neighborhood ? (section.neighborhood | titlecase) : '-' }}
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Ville: </span>
                  {{ section.city ? (section.city | titlecase) : '-' }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="px-4 py-3" *ngIf="section.optionalProperties.length > 0">
            <dt class="text-sm leading-5 font-medium mr-1 text-gray-500">
              Informations complémentaires
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md py-3">
                <li
                  class=" border-gray-200 pl-3 pr-4 py-1 text-sm leading-5"
                  *ngFor="let item of section.optionalProperties"
                >
                  <span class="font-medium mr-1">{{ item.key | titlecase }}: </span>
                  {{ item.value | titlecase }}
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </ng-container>
  `,
})
export class SectionInfosComponent implements OnInit, OnDestroy {
  @Select(SectionsState.getSelectedSection) selectedSection$: Observable<Section>
  @Select((state) => state.router.state.params.id) id$: Observable<ID>
  private subs = new Subscription()

  constructor(private mapComponent: CustomMapComponent, private store: Store) {}

  ngOnInit(): void {
    this.subs.add(
      this.id$.subscribe((id) => {
        this.subs.add(
          this.store
            .dispatch(new GetSectionById(id))
            .pipe(take(1))
            .subscribe((state) => {
              this.openDrawer()
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

  private openDrawer(): void {
    this.store.dispatch(new OpenDrawer())
  }

  // Use in section guards
  public closeDrawer(): Promise<boolean> {
    return this.store.dispatch(new CloseDrawer()).toPromise()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
    this.removeSourceAndLayer('selectedSection')
    this.closeDrawer()
  }
}
