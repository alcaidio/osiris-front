import { Component, ViewEncapsulation } from '@angular/core'
import { Store } from '@ngxs/store'
import { OpenDrawer } from './../store/actions/ui.action'

@Component({
  selector: 'app-buttons-menu',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/map.component.scss'],
  template: `
    <div class="absolute right-0 z-99" style="top: 250px">
      <div class="flex flex-col">
        <button mat-raised-button color="primary" (click)="onClick()" routerLink="/map/filter" routerLinkActive="active" class="first" >
          <mat-icon  [svgIcon]="'feather:layers'" [matTooltipPosition]="'left'" matTooltip="Filtres"></mat-icon>
        </button>
        <button mat-raised-button color="primary" (click)="onClick()" routerLinkActive="active" class="between" >
          <mat-icon [svgIcon]="'feather:sliders'" [matTooltipPosition]="'left'" matTooltip="Exemple"></mat-icon>
        </button>
        <button mat-raised-button color="primary" (click)="onClick()" routerLinkActive="active" class="last" >
          <mat-icon [svgIcon]="'feather:map'" [matTooltipPosition]="'left'" matTooltip="Exemple"></mat-icon>
        </button>
      </div>
    </div>
  `
})
export class ButtonsMenuComponent {
  constructor(private store: Store) {}

  onClick() {
    this.store.dispatch(new OpenDrawer())
  }
}
