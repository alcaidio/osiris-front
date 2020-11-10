import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { TreoMediaWatcherService } from '@treo/services/media-watcher'
import { Observable } from 'rxjs'
import { ChangeDrawerMode, CloseDrawer, UIState } from '../store'
import { Section } from './../models/section.model'
import { SectionState } from './../store/section/section.state'

@Component({
  selector: 'app-section-infos',
  template: `
    <app-drawer-sidenav
      *transloco="let t; read: 'diagnosis.info'"
      [title]="t('title')"
      [icon]="'location_searching'"
      [tooltip]="t('tooltip')"
      [isScreenSmall]="isScreenSmall"
      (close)="onClose()"
      (action)="goToSection()"
    >
      <ng-container *ngIf="selectedSection$ | async as section; else noSection">
        <mat-list *ngIf="section.properties as property" class="px-5 py-2 ml-5 mt-4">
          <div mat-list-item class="mt-2">
            <div class="mb-2 mt-3 text-lg font-medium" mat-line>{{ t('characteristics') }}</div>
            <div mat-line *ngIf="property.state">
              {{ t('state') }}: {{ property.state | titlecase }}
              <!-- <mat-icon
                class="icon-size-12 text-gray cursor-pointer"
                [svgIcon]="'dripicons:question'"
                [matTooltipPosition]="'right'"
                matTooltip="Good / Medium / Bad / Very bad"
              ></mat-icon> -->
            </div>
            <div mat-line *ngIf="property.length">{{ t('length') }}: {{ property.length + ' m' }}</div>
            <div mat-line *ngIf="property.width">{{ t('width') }}: {{ property.width + ' m' }}</div>
          </div>
          <div mat-list-item class="mt-5">
            <div class="mb-2 mt-2 text-lg font-medium" mat-line>{{ t('localisation') }}</div>
            <div mat-line *ngIf="property.streetName">{{ t('street') }}: {{ property.streetName }}</div>
            <div mat-line *ngIf="property.neighborhood">{{ t('neighborhood') }}: {{ property.neighborhood }}</div>
            <div mat-line *ngIf="property.city">{{ t('city') }}: {{ property.city }}</div>
          </div>
          <div *ngIf="property.optionalProperties.length > 0" mat-list-item class="mt-5">
            <div class="mb-2 mt-3 text-lg font-medium" mat-line>{{ t('further') }}</div>
            <div mat-line *ngFor="let item of property.optionalProperties">
              {{ item.key | titlecase }}: {{ item.value | titlecase }}
            </div>
          </div>
        </mat-list>
      </ng-container>
      <ng-template #noSection>
        <div class="px-4 py-3 mt-3">{{ t('no', { id: (this.route.params | async)?.id }) }}</div>
      </ng-template>
    </app-drawer-sidenav>
  `,
})
export class SectionInfosComponent implements OnInit {
  @Select(UIState.getDrawerOpened) isOpen$: Observable<boolean>
  @Select(SectionState.getSelectedSection) selectedSection$: Observable<Section>
  isScreenSmall: boolean

  constructor(private store: Store, private media: TreoMediaWatcherService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeDrawerMode('side'))
    const isOpened = this.store.selectSnapshot<boolean>((state) => {
      return state.diagnosis.diagnosisUi.drawer.opened
    })

    if (isOpened) {
      this.store.dispatch(new CloseDrawer())
    }

    this.media.onMediaChange$.subscribe(({ matchingAliases }) => {
      this.isScreenSmall = matchingAliases.includes('xs')
    })
  }

  goToSection(): void {
    console.log('aller à la section, voir router outlet on activate')
  }

  public onClose(): Promise<boolean> {
    return this.store.dispatch(new CloseDrawer()).toPromise()
  }
}
