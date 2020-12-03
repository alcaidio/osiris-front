import { Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { UIState } from '../store'
import { CloseDrawer, OpenDrawer } from '../store/ui/ui.action'

@Component({
  selector: 'app-sidenav-toggle',
  template: `
    <div class="absolute right-0 z-99" style="top: 0px">
      <div class="flex flex-col">
        <button *ngIf="drawerOpened$ | async" mat-raised-button color="warn" (click)="onClose()" class="drawer-switch">
          <mat-icon [svgIcon]="'feather:chevron-right'"></mat-icon>
        </button>
        <button
          *ngIf="!(drawerOpened$ | async)"
          mat-raised-button
          color="warn"
          (click)="onOpen()"
          class="drawer-switch"
        >
          <mat-icon [svgIcon]="'feather:chevron-left'"></mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .drawer-switch {
        width: 30px !important;
        min-width: unset !important;
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
    `,
  ],
})
export class SidenavToggleComponent {
  @Select(UIState.getDrawerOpened) drawerOpened$: Observable<boolean>

  constructor(private store: Store) {}

  onOpen() {
    this.store.dispatch(new OpenDrawer())
  }

  onClose() {
    this.store.dispatch(new CloseDrawer())
  }
}
