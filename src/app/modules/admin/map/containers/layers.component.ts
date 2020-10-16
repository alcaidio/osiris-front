import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Filter } from '../models/layer.model'
import { LayersState, ToggleLayer } from '../store'

@Component({
  selector: 'app-layers',
  styleUrls: ['./styles/layers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <ng-container *transloco="let t; read: 'map.layers'">
      <app-map-drawer [isLoading]="isLoading$ | async" [title]="t('title')">
          <ng-container *ngIf="(filters$ | async)?.length > 0; else noFilters">
            <mat-list class="px-5 py-2 ml-5 mt-4">
              <div mat-list-item>
                <div class="mb-3 text-lg font-medium" mat-line>{{ t('state.title') }}</div>
                <div class="ml-4" mat-line *ngFor="let filter of filters$ | async">
                  <mat-checkbox class="mb-1" [checked]="filter.visible" (change)="onToggle(filter.id)">
                    {{ filter.name }}
                  </mat-checkbox>
                </div>
              </div>
            </mat-list>
          </ng-container>
          <ng-template #noFilters>
            <div class="flex">
              <div class="m-auto pt-12">
                {{ t('unvailable') }}
              </div>
            </div>
          </ng-template>
      </app-map-drawer>
    </ng-container>
  `
})
export class LayersComponent {

  constructor(private store: Store) {}
  @Select(LayersState.getLoading) isLoading$: Observable<boolean>
  @Select(LayersState.getFilter) filters$: Observable<Filter[]>

  onToggle(id: string) {
    this.store.dispatch(new ToggleLayer(id))
  }
}
