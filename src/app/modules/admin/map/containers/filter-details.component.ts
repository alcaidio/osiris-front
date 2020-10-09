import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LayersState, ToggleLayer } from '../store'
import { Filter } from './../models/layer.model'
import { CloseDrawer, OpenDrawer } from './../store/actions/ui.action'

@Component({
  selector: 'app-filter-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t">
      <div class="bg-gray-50 p-5 border-b border-gray-200">
        <div class="text-lg leading-6 font-medium text-gray-900">
          {{ t('map.filter.title') }}
        </div>
      </div>
      <div class="px-4 py-3 mt-2">
        <ng-container *ngIf="isLoading$ | async">
          Loading
        </ng-container>
        <ng-container *ngIf="isLoaded$ | async">
          <ng-container *ngIf="(filters$ | async)?.length > 0; else noFilters">
            <dt class="text-sm leading-5 font-medium text-gray-500 mb-3">
              {{ t('map.filter.state.title') }}
            </dt>
            <dd class="ml-2 mt-1 text-sm leading-5 text-gray-900" *ngFor="let filter of filters$ | async">
              <mat-checkbox color="primary" [checked]="filter.visible" (change)="onToggle(filter.id)">
                {{ filter.name }}
              </mat-checkbox>
            </dd>
          </ng-container>
          <ng-template #noFilters>
            {{ t('map.filter.no') }}
          </ng-template>
        </ng-container>
      </div>
    </ng-container>
  `,
})
export class FilterDetailsComponent implements AfterContentInit, OnDestroy {
  @Select(LayersState.getLoading) isLoading$: Observable<boolean>
  @Select(LayersState.getLoaded) isLoaded$: Observable<boolean>
  @Select(LayersState.getFilter) filters$: Observable<Filter[]>

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.store.dispatch(new OpenDrawer())
    })
  }

  onToggle(id: string) {
    this.store.dispatch(new ToggleLayer(id))
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CloseDrawer())
  }
}
