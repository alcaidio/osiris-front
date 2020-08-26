import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LayersState, ToggleLayer } from '../store'
import { CloseDrawer, OpenDrawer } from './../store/actions/ui.action'

@Component({
  selector: 'app-filter-details',
  template: `
    <div class="bg-gray-50 p-5 border-b border-gray-200">
      <div class="text-lg leading-6 font-medium text-gray-900">
        Filtres
      </div>
    </div>
    <div class="px-4 py-3 mt-2">
      <ng-container *ngIf="(filters$ | async)?.length > 0; else noFilters">
        <dt class="text-sm leading-5 font-medium text-gray-500 mb-3">
          Etat de la voirie
        </dt>
        <dd class="ml-2 mt-1 text-sm leading-5 text-gray-900" *ngFor="let filter of filters$ | async">
          <mat-checkbox color="primary" [checked]="filter.visible" (change)="onToggle(filter.id)">
            {{ filter.name }}
          </mat-checkbox>
        </dd>
      </ng-container>
      <ng-template #noFilters>
        Pas de filtres disponibles
      </ng-template>
    </div>
  `,
})
export class FilterDetailsComponent implements OnInit, OnDestroy {
  @Select(LayersState.getFilter) filters$: Observable<any>

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new OpenDrawer())
  }

  onToggle(id: string) {
    this.store.dispatch(new ToggleLayer(id))
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CloseDrawer())
  }
}
