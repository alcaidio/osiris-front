import { Component, Input } from '@angular/core'
import { Store } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { ChangeMapStyle, ToggleBuildindsLayer } from '../store'
import { TreoAnimations } from './../../../../../@treo/animations/public-api'

export interface Item {
  id: string
  icon: string
  tooltip?: string
  action?: string
}

@Component({
  selector: 'app-button-fab-map',
  animations: TreoAnimations,
  template: `
    <div class="flex items-center justify-center">
      <button color="warn" mat-mini-fab (click)="onToggleButton()" class="rotate">
        <mat-icon [svgIcon]="iconFirst"></mat-icon>
      </button>
      <ng-container *ngIf="opened">
        <button
          *ngFor="let item of items"
          mat-mini-fab
          color="primary"
          class="ml-4"
          [matTooltipPosition]="'above'"
          [matTooltip]="item.tooltip"
          (click)="onClick(item)"
          @slideInLeft
          @zoomOut
        >
          <mat-icon *ngIf="!isImage" [svgIcon]="item.icon"></mat-icon>
          <img *ngIf="isImage" class="h-10 w-10 rounded-full overflow-hidden" [src]="item.icon" />
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .rotate:hover {
        transform: rotate(-15deg);
      }
    `,
  ],
})
export class ButtonFabMapComponent {
  @Input() opened = false
  @Input() iconFirst: string
  @Input() items: Item[]
  @Input() isImage = false

  constructor(private store: Store, private snack: NotificationService) {}

  onToggleButton(): void {
    this.opened = !this.opened
  }

  onClick(item: Item) {
    switch (item.action) {
      case '3d': {
        this.store.dispatch(new ToggleBuildindsLayer())
        break
      }
      case 'switchMap': {
        this.store.dispatch(new ChangeMapStyle(item.id))
        break
      }
      default: {
        // tslint:disable-next-line: quotemark
        this.snack.openSnackBar("Pas d'action valide pour ce bouton.", 'X')
        break
      }
    }
    this.onToggleButton()
  }
}
