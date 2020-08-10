import { Component } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Store } from '@ngxs/store'

@Component({
  selector: 'app-buttons-menu',
  template: `
    <div class="absolute right-0 z-99" style="top: 250px">
      <div class="flex flex-col">
        <div
          class="flex items-center justify-center bg-cool-gray-400 px-2 py-3 cursor-pointer shadow rounded-tl"
          (click)="onClick('/map/filter')"
        >
          <mat-icon
            class="icon-size-16 text-white"
            [svgIcon]="'feather:layers'"
            [matTooltipPosition]="'left'"
            matTooltip="Filtres"
          ></mat-icon>
        </div>
        <div
          class="flex items-center justify-center bg-cool-gray-400 px-2 py-3 cursor-pointer shadow border-t border-b border-cool-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out"
          (click)="onClick('/map/filter')"
        >
          <mat-icon
            class="icon-size-16 text-white"
            [svgIcon]="'feather:sliders'"
            [matTooltipPosition]="'left'"
            matTooltip="Filtres"
          ></mat-icon>
        </div>
        <div
          class="flex items-center justify-center bg-cool-gray-400 px-2 py-3 cursor-pointer shadow rounded-bl"
          (click)="onClick('/map/filter')"
        >
          <mat-icon
            class="icon-size-16 text-white"
            [svgIcon]="'feather:map'"
            [matTooltipPosition]="'left'"
            matTooltip="Filtres"
          ></mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ButtonsMenuComponent {
  constructor(private store: Store) {}

  onClick(url: string): void {
    this.store.dispatch(new Navigate([url]))
  }
}
