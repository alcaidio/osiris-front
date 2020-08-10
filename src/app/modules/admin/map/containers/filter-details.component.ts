import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { CustomMapComponent } from '../containers/map.component'
import { LayersState, ToggleLayer } from '../store'

@Component({
  selector: 'app-filter-details',
  template: `
    <ng-container *ngIf="filters$ | async as filters">
      <div class="bg-gray-50 p-5 border-b border-gray-200">
        <div class="text-lg leading-6 font-medium text-gray-900">
          Filtres
        </div>
      </div>
      <div class="px-4 py-3 mt-2">
        <dt class="text-sm leading-5 font-medium text-gray-500 mb-3">
          Etat de la voirie
        </dt>
        <dd class="ml-2 mt-1 text-sm leading-5 text-gray-900" *ngFor="let filter of filters">
          <mat-checkbox color="primary" [checked]="filter.visible" (change)="onToggle(filter.id)">
            {{ filter.name }}
          </mat-checkbox>
        </dd>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class FilterDetailsComponent implements OnInit, OnDestroy {
  @Select(LayersState.getFilter) filters$: Observable<any>

  constructor(private mapComponent: CustomMapComponent, private store: Store) {}

  ngOnInit(): void {
    this.mapComponent.matDrawer.open()
  }

  onToggle(id: string) {
    this.store.dispatch(new ToggleLayer(id))
  }

  ngOnDestroy(): void {
    this.mapComponent.matDrawer.close()
  }
}
