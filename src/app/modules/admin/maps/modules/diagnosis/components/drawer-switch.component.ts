import { Component } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { ToggleDrawer, UIState } from '../store'

@Component({
  selector: 'app-drawer-switch',
  styleUrls: ['./styles/map.component.scss'],
  template: `
    <div class="absolute right-0 z-99" style="top: 0px">
      <div class="flex flex-col">
        <button mat-raised-button color="warn" (click)="onClick()" class="drawer-switch" >
          <mat-icon [svgIcon]="(drawerOpened$ | async) ? 'feather:chevron-right' : 'feather:chevron-left'"></mat-icon>
        </button>
      </div>
    </div>
  `
  })
export class DrawerSwitchComponent {
  @Select(UIState.getDrawerOpened) drawerOpened$: Observable<boolean>

  constructor(private store: Store) {}

  onClick() {
    this.store.dispatch(new ToggleDrawer())
  }
}
