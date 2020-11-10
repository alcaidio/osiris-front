import { Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { UIState } from '../store'
import { ToggleDrawer } from '../store/ui/ui.action'

@Component({
  selector: 'app-sidenav-toggle',
  template: `
    <div class="absolute right-0 z-99" style="top: 0px">
      <div class="flex flex-col">
        <button mat-raised-button color="warn" (click)="onToggle()" class="drawer-switch">
          <mat-icon [svgIcon]="(drawerOpened$ | async) ? 'feather:chevron-right' : 'feather:chevron-left'"></mat-icon>
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

  onToggle() {
    this.store.dispatch(new ToggleDrawer())
  }
}
