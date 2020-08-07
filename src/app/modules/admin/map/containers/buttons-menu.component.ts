import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Navigate } from '@ngxs/router-plugin'
import { Store } from '@ngxs/store'

@Component({
  selector: 'app-buttons-menu',
  template: `
    <div class="absolute right-0 z-99" style="top: 250px">
      <div class="flex flex-col">
        <div
          class="flex items-center justify-center bg-cool-gray-600 px-2 py-3 cursor-pointer rounded-tl-lg"
          (click)="onClick('/map/filter')"
        >
          <mat-icon class="icon-size-20 text-white" [svgIcon]="'feather:filter'"></mat-icon>
        </div>
        <div
          class="flex items-center justify-center bg-cool-gray-600 px-2 py-3 cursor-pointer border-t border-gray-800 rounded-bl-lg"
          (click)="onClick('/map/filter')"
        >
          <mat-icon class="icon-size-20 text-white" [svgIcon]="'feather:filter'"></mat-icon>
        </div>
        <!-- add some button here, remove rounded-bl-lg at the top and add at the bottom-->
      </div>
    </div>
  `,
  styles: [],
})
export class ButtonsMenuComponent {
  constructor(private store: Store, private router: Router) {}

  onClick(url: string): void {
    if (this.router.url === url) {
      this.store.dispatch(new Navigate(['/map']))
    } else {
      this.store.dispatch(new Navigate([url]))
    }
  }
}
