import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { ID } from 'app/shared/shared.model'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { Section } from '../models/section.model'
import { BaseMapState, CloseDrawer, GetSectionById } from '../store'
import { SectionsState } from '../store/states/section.state'
import { CustomMapComponent } from './map.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-section-infos',
  template: `
    <ng-container *transloco="let t">
      <app-map-drawer [title]="t('map.info.title')" [icon]="'location_searching'" [tooltip]="t('map.info.tooltip')" (action)="goToSection()">
        <ng-container *ngIf="section; else noSection">
          <mat-list *ngIf="section.properties as property" class="px-5 py-2 ml-5 mt-4">
            <div mat-list-item class="mt-2">
              <div class="mb-2 mt-3 text-lg font-medium" mat-line>{{ t('map.info.characteristics') }}</div>
              <div mat-line *ngIf="property.state">
                {{ t('map.info.state') }}: {{ property.state | titlecase }}
                <mat-icon
                  class="icon-size-12 text-gray cursor-pointer"
                  [svgIcon]="'dripicons:question'"
                  [matTooltipPosition]="'right'"
                  matTooltip="Good / Medium / Bad / Very bad"
                ></mat-icon>
              </div>
              <div mat-line *ngIf="property.length">{{ t('map.info.length') }}: {{ property.length + ' m' }}</div> 
              <div mat-line *ngIf="property.width">{{ t('map.info.width') }}: {{ property.width + ' m' }}</div> 
            </div>
            <div mat-list-item class="mt-5">
              <div class="mb-2 mt-2 text-lg font-medium" mat-line>{{ t('map.info.localisation') }}</div>
              <div mat-line *ngIf="property.streetName">{{ t('map.info.street') }}: {{ property.streetName }}</div> 
              <div mat-line *ngIf="property.neighborhood">{{ t('map.info.neighborhood') }}: {{ property.neighborhood }}</div> 
              <div mat-line *ngIf="property.city">{{ t('map.info.city') }}:  {{ property.city }}</div> 
            </div>
            <div *ngIf="property.optionalProperties.length > 0" mat-list-item class="mt-5">
              <div class="mb-2 mt-3 text-lg font-medium" mat-line>{{ t('map.info.further') }}</div>
              <div mat-line *ngFor="let item of property.optionalProperties">{{ item.key | titlecase }}: {{ item.value | titlecase }}</div> 
            </div>
          </mat-list>
        </ng-container>
        <ng-template #noSection>
          <div class="px-4 py-3 mt-3" *ngIf="id$ | async as id">{{ t('map.info.no', { id: id }) }}</div>
        </ng-template>
      </app-map-drawer>
    </ng-container>
  `
})
export class SectionInfosComponent implements OnInit, OnDestroy {
  @Select(SectionsState.getSelectedSection) selectedSection$: Observable<Section>
  @Select(SectionsState.getSectionColor) sectionColor$: Observable<string>
  @Select(BaseMapState.getMapIsRender) mapIsRender$: Observable<boolean>
  @Select((state) => state.router.state.params.id) id$: Observable<ID>
  section: Section
  
  constructor(private mapComponent: CustomMapComponent, private store: Store) {}

  ngOnInit(): void {
    this.id$.subscribe((id) => {
      if (id !== undefined) {
        this.store.dispatch(new GetSectionById(id))
      }
    })

    this.selectedSection$.subscribe(section => {   
      this.section = section
      this.mapIsRender$.subscribe(isLoad => {  
        if (isLoad && section) {     
          setTimeout(() => {
            this.goToSection()
          })   
        }
      })
    })
  }

  goToSection(): void {
    this.flyToSection(this.section)
    setTimeout(() => this.displaySelectedSection(this.section), 250)
  }

  private flyToSection(section: Section): void {
    // padding right depend of the drawer size (375px)
    // don't tuch padding because bug !
    this.mapComponent.mapInstance.fitBounds([section.bbox[0], section.bbox[1], section.bbox[2], section.bbox[3]], {
      padding: { top: 200, bottom: 200, left: 200, right: 575 },
      // maxDuration: 2500
    })
  }

  private displaySelectedSection(section: Section): void {
    if (section.geometry) {
      const map = this.mapComponent.mapInstance
      const id = 'selectedSection'

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
    }
  }

  private removeSourceAndLayer(id: string): void {
    const map = this.mapComponent.mapInstance
    if (map.getLayer(id) && map.getSource(id)) {
      map.removeLayer(id)
      map.removeSource(id)
    }
  }

  // Use in section guards
  public closeDrawer(): Promise<boolean> {
    return this.store.dispatch(new CloseDrawer()).toPromise()
  }

  ngOnDestroy(): void {
    this.removeSourceAndLayer('selectedSection')
  }
}
