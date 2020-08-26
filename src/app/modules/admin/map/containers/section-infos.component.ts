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
    <div>
      <div class="flex items-center justibg-gray-50 p-5 border-b border-gray-200">
        <div class="text-lg leading-6 font-medium text-gray-900 mr-2">
          Informations du tronçon
        </div>
        <mat-icon
          *ngIf="selectedSection$ | async as section"
          class="icon-size-16 text-gray cursor-pointer"
          [svgIcon]="'dripicons:crosshair'"
          [matTooltipPosition]="'below'"
          matTooltip="Go to the section"
          (click)="goToSection(section)"
        ></mat-icon>
      </div>
      <ng-container *ngIf="(selectedSection$ | async)?.id; else noSection">
        <dl *ngIf="(selectedSection$ | async)?.properties as sectionProp">
          <div class="px-4 py-3 mt-2">
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Cractéristiques
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md">
                <li class="pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Etat: </span>
                  {{ sectionProp.state ? (sectionProp.state | titlecase) : 'Inconnu' }}
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
                      {{ sectionProp.length ? sectionProp.length + ' m' : 'null' }}
                    </div>
                    <div class="flex-1">
                      <span class="font-medium mr-1">Largeur: </span>
                      {{ sectionProp.width ? sectionProp.width + ' m' : 'null' }}
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
                  {{ sectionProp.streetName ? (sectionProp.streetName | titlecase) : '-' }}
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Quartier: </span>
                  {{ sectionProp.neighborhood ? (sectionProp.neighborhood | titlecase) : '-' }}
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">Ville: </span>
                  {{ sectionProp.city ? (sectionProp.city | titlecase) : '-' }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="px-4 py-3" *ngIf="sectionProp.optionalProperties.length > 0">
            <dt class="text-sm leading-5 font-medium mr-1 text-gray-500">
              Informations complémentaires
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md py-3">
                <li
                  class=" border-gray-200 pl-3 pr-4 py-1 text-sm leading-5"
                  *ngFor="let item of sectionProp.optionalProperties"
                >
                  <span class="font-medium mr-1">{{ item.key | titlecase }}: </span>
                  {{ item.value | titlecase }}
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </ng-container>
      <ng-template #noSection>
        <div class="px-4 py-3 mt-2" *ngIf="id$ | async as id">
          Aucune informations disponibles pour le tronçon n°{{ id }}.
        </div>
      </ng-template>
    </div>
  `,
})
export class SectionInfosComponent implements OnInit, OnDestroy {
  @Select(SectionsState.getSelectedSection) selectedSection$: Observable<Section>
  @Select(SectionsState.getSectionColor) sectionColor$: Observable<string>

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
              const selectedSection = state.map.sections.selectedSection
              this.flyToSection(selectedSection)
              setTimeout(() => this.displaySelectedSection(selectedSection), 200)
            })
        )
      })
    )
  }

  goToSection(section: Section): void {
    this.flyToSection(section)
  }

  private flyToSection(section: Section): void {
    if (section.bbox) {
      const map = this.mapComponent.map.mapInstance
      const { sw, ne } = section.bbox
      // padding right depend of the drawer size (375px)
      map.fitBounds([sw, ne], { padding: { top: 200, bottom: 200, left: 200, right: 550 } })
    }
  }

  private displaySelectedSection(section: Section): void {
    if (section.geometry) {
      const map = this.mapComponent.map.mapInstance
      const id = 'selectedSection'

      this.subs.add(
        this.sectionColor$.subscribe((color) => {
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
              'line-color': color,
              'line-width': 18,
              'line-blur': 1.5,
              'line-opacity': 0.6,
            },
          })
        })
      )
    }
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
