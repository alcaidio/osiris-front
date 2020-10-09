import { AfterContentInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LayersState, ToggleLayer } from '../store'
import { Filter } from './../models/layer.model'
import { CloseDrawer, OpenDrawer } from './../store/actions/ui.action'

@Component({
  selector: 'app-filter-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside *transloco="let t">
      <div class="flex items-center justify-between bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div class="text-2xl font-medium leading-tight">{{ t('map.filter.title') }}</div>
        <div class="-mr-3">
          <button mat-icon-button (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="px-6 py-4 mt-1">
        <ng-container *ngIf="isLoaded$ | async">
          <ng-container *ngIf="(filters$ | async)?.length > 0; else noFilters">
            <dt class="text-lg font-medium text-gray-500 mb-4">
              {{ t('map.filter.state.title') }}
            </dt>
            <dd class="ml-3 mt-2 leading-5 text-gray-900" *ngFor="let filter of filters$ | async">
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
    </aside>
  `,
})
export class FilterDetailsComponent implements AfterContentInit, OnDestroy {
  @Select(LayersState.getLoaded) isLoaded$: Observable<boolean>
  @Select(LayersState.getFilter) filters$: Observable<Filter[]>

  constructor(private store: Store) {}

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.store.dispatch(new OpenDrawer())
    })
  }

  onToggle(id: string) {
    this.store.dispatch(new ToggleLayer(id))
  }

  onClose() {
    this.store.dispatch(new CloseDrawer())
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CloseDrawer())
  }
}
