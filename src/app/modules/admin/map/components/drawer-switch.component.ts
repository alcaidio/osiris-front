import { Component, Input } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'

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
            [svgIcon]="this.drawer.opened ? 'feather:chevron-right' : 'feather:chevron-left'"
          ></mat-icon>
        </div>
      </div>
    </div>
  `,
})
export class DrawerSwitchComponent {
  @Input() drawer: MatDrawer

  onClick() {
    this.drawer.toggle()
  }
}
