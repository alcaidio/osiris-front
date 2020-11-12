import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Overlay } from '../../../shared/models'
import { BaseMapState, ChangeDrawerMode, OpenDrawer, ToggleOverlay } from '../store'

@Component({
  selector: 'app-overlays',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-drawer-sidenav *transloco="let t; read: 'diagnosis.layers'" [title]="t('title')">
      <ng-container *ngIf="(overlays$ | async)?.length > 0; else noOverlays">
        <mat-list class="px-5 py-2 ml-5 mt-4">
          <div mat-list-item>
            <div class="mb-3 text-lg font-medium" mat-line>{{ t('state.title') }}</div>
            <div class="ml-4" mat-line *ngFor="let overlay of overlays$ | async">
              <mat-checkbox class="mb-1" [checked]="overlay.visible" (change)="onToggle(overlay.id)">
                {{ overlay.name }}
              </mat-checkbox>
            </div>
          </div>
        </mat-list>
      </ng-container>
      <ng-template #noOverlays>
        <div class="flex">
          <div class="m-auto pt-12">
            {{ t('unvailable') }}
          </div>
        </div>
      </ng-template>
    </app-drawer-sidenav>
  `,
})
export class OverlaysComponent implements OnInit {
  @Select(BaseMapState.getOverlays) overlays$: Observable<Overlay[]>

  constructor(private store: Store) {}

  ngOnInit(): void {
    // this.store.dispatch(new ChangeDrawerMode('side'))
    const isOpened = this.store.selectSnapshot<boolean>((state) => {
      return state.diagnosis.diagnosisUi.drawer.opened
    })
    if (!isOpened) {
      this.store.dispatch(new OpenDrawer())
    }
  }

  onToggle(id: string) {
    this.store.dispatch(new ToggleOverlay(id))
  }
}
