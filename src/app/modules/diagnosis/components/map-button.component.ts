import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { TreoAnimations } from '@treo/animations'
import { ButtonMapItem } from './../../../shared/models/maps.model'

@Component({
  selector: 'app-map-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class MapButtonComponent {
  @Input() opened = false
  @Input() iconFirst: string
  @Input() items: ButtonMapItem[]
  @Input() isImage = false
  @Output() action = new EventEmitter<ButtonMapItem>()

  onToggleButton(): void {
    this.opened = !this.opened
  }

  onClick(item: ButtonMapItem) {
    this.action.emit(item)
    this.onToggleButton()
  }
}
