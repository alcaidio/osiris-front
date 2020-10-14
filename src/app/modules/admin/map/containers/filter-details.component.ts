import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LayersState, ToggleLayer } from '../store'
import { Filter } from './../models/layer.model'

@Component({
  selector: 'app-filter-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <ng-container *transloco="let t">
      <app-map-drawer [isLoading]="isLoading$ | async" [title]="t('map.filter.title')">
          <ng-container *ngIf="(filters$ | async)?.length > 0; else noFilters">
            <mat-list class="px-5 py-2 ml-5 mt-4">
              <div mat-list-item>
                <div class="mb-3 text-lg font-medium" mat-line>{{ t('map.filter.state.title') }}</div>
                <div class="ml-4" mat-line *ngFor="let filter of filters$ | async">
                  <mat-checkbox class="mb-1" color="primary" [checked]="filter.visible" (change)="onToggle(filter.id)">
                    {{ filter.name }}
                  </mat-checkbox>
                </div>
              </div>
            </mat-list>
          </ng-container>
          <ng-template #noFilters>
            {{ t('map.filter.no') }}
          </ng-template>
      </app-map-drawer>
    </ng-container>
  `,
})
export class FilterDetailsComponent {
  @Select(LayersState.getLoading) isLoading$: Observable<boolean>
  @Select(LayersState.getFilter) filters$: Observable<Filter[]>

  constructor(private store: Store) {}

  onToggle(id: string) {
    this.store.dispatch(new ToggleLayer(id))
  }
}
