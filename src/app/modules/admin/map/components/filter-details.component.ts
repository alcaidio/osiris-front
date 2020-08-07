import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { CustomMapComponent } from '../containers/map.component'
import { LayersState, ToggleLayer } from '../store'

@Component({
  selector: 'app-filter-details',
  template: `
    <div>
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold leading-tight">Filtres</div>
      </div>
      <div class="flex items-center justify-between mt-6">
        <span class="font-medium text-secondary">Etat de la voirie</span>
      </div>
      <div class="flex flex-col mt-2 ml-6">
        <ng-container *ngFor="let filter of filters$ | async">
          <mat-checkbox class="my-1" color="primary" [checked]="filter.visible" (change)="onToggle(filter.id)">
            {{ filter.name }}
          </mat-checkbox>
        </ng-container>
      </div>
    </div>
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
