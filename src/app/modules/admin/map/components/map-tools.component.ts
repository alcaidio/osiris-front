import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core'
import { TreoAnimations } from './../../../../../@treo/animations/public-api'

@Component({
  selector: 'app-map-tools',
  animations: TreoAnimations,
  template: `
    <div class="absolute left-0 z-99" style="top: 75%">
      <div class="relative ml-4">
        <div class="flex items-center justify-center">
          <div
            class="flex items-center justify-center h-10 w-10 mr-4 bg-cool-gray-400 cursor-pointer rounded-full shadow-lg rotate"
            (click)="onToggleButtons()"
          >
            <mat-icon class="icon-size-20 text-white z-50" [svgIcon]="'feather:tool'"></mat-icon>
          </div>
          <ng-container *ngIf="isOpen">
            <div
              *ngFor="let item of items"
              class="flex items-center justify-center h-10 w-10 bg-cool-gray-400 cursor-pointer rounded-full shadow-lg mr-3 z-10"
              [matTooltipPosition]="'above'"
              [matTooltip]="item.tooltip"
              (click)="action.emit(item.id)"
              @slideInLeft
              @zoomOut
            >
              <mat-icon class="icon-size-20 text-white z-50 rot" [svgIcon]="item.icon"></mat-icon>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .rot {
        transform: rotate(45deg);
      }
      .rotate:hover {
        transform: rotate(-15deg);
      }
    `,
  ],
})
export class MapToolsComponent implements OnInit, OnDestroy {
  isOpen: boolean
  items: { id: string; icon: string; tooltip: string }[]
  @Output() action = new EventEmitter<string>()

  ngOnInit(): void {
    this.isOpen = false
    this.items = [{ id: 'distance', icon: 'iconsmind:ruler', tooltip: 'Distance' }]
  }

  onToggleButtons(): void {
    this.isOpen = !this.isOpen
    if (!this.isOpen) {
      this.action.emit('null')
    }
  }

  ngOnDestroy() {
    this.action.emit('null')
  }
}
