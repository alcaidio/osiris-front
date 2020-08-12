import { Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { ToggleDrawer, UIState } from '../store'

@Component({
  selector: 'app-drawer-switch',
  template: `
    <div class="absolute right-0 z-99" style="top: 0px">
      <div class="flex flex-col">
        <div
          class="flex items-center justify-center bg-cool-gray-400 px-1 py-2 cursor-pointer rounded-bl shadow"
          (click)="onClick()"
        >
          <mat-icon
            class="icon-size-16 text-white"
            [svgIcon]="(drawerOpened$ | async) ? 'feather:chevron-right' : 'feather:chevron-left'"
          ></mat-icon>
        </div>
      </div>
    </div>
  `,
})
export class DrawerSwitchComponent {
  @Select(UIState.getDrawerOpened) drawerOpened$: Observable<boolean>

  constructor(private store: Store) {}

  onClick() {
    this.store.dispatch(new ToggleDrawer())
  }
}
