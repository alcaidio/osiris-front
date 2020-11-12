import { Component } from '@angular/core'
import { Store } from '@ngxs/store'
import { OpenDrawer } from '../store'

@Component({
  selector: 'app-map-menu',
  template: `
    <div class="absolute z-99" style="top: 250px; right: 0px;">
      <div class="flex flex-col">
        <button
          mat-raised-button
          (click)="onClick()"
          color="warn"
          routerLink="/diagnosis/overlays"
          routerLinkActive="active"
          class="one"
        >
          <mat-icon [svgIcon]="'feather:layers'" [matTooltipPosition]="'left'" matTooltip="Layers"></mat-icon>
        </button>
        <!-- <button mat-raised-button color="warn" routerLinkActive="active" class="between">
          <mat-icon [svgIcon]="'feather:sliders'" [matTooltipPosition]="'left'" matTooltip="Exemple 1"></mat-icon>
        </button>
        <button mat-raised-button color="warn" routerLinkActive="active" class="last">
          <mat-icon [svgIcon]="'feather:settings'" [matTooltipPosition]="'left'" matTooltip="Exemple 2"></mat-icon>
        </button> -->
      </div>
    </div>
  `,
  styles: [
    `
      button {
        width: 40px !important;
        min-width: unset !important;
      }

      button.one {
        border-bottom-right-radius: 0 !important;
        border-top-right-radius: 0 !important;
      }

      button.first {
        border-bottom-right-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
      }

      button.between {
        border-bottom-right-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
        border-top-left-radius: 0 !important;
        border-top: 1px solid white;
      }

      button.last {
        border-bottom-right-radius: 0 !important;
        border-top-right-radius: 0 !important;
        border-top-left-radius: 0 !important;
        border-top: 1px solid white;
      }
    `,
  ],
})
export class MapMenuComponent {
  constructor(private store: Store) {}

  onClick() {
    this.store.dispatch(new OpenDrawer())
  }
}
