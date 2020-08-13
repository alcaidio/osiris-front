import { Component, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { ToggleBuildindsLayer } from '../store'
import { ToggleButtonTools } from '../store/actions/ui.action'
import { UIState } from '../store/states/ui.state'
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
          <ng-container *ngIf="isOpen$ | async">
            <div
              *ngFor="let item of items"
              class="flex items-center justify-center h-10 w-10 bg-cool-gray-400 cursor-pointer rounded-full shadow-lg mr-3 z-10"
              [matTooltipPosition]="'above'"
              [matTooltip]="item.tooltip"
              (click)="onClick(item.id)"
              @slideInLeft
              @zoomOut
            >
              <mat-icon class="icon-size-20 text-white z-50" [svgIcon]="item.icon"></mat-icon>
            </div>
          </ng-container>
        </div>
      </div>
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
export class MapToolsComponent implements OnInit {
  @Select(UIState.getButtonTools) isOpen$: Observable<boolean>
  items: { id: string; icon: string; tooltip: string }[]
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.items = [
      { id: '3d', icon: 'feather:codepen', tooltip: '3D' },
      { id: 'distance', icon: 'iconsmind:ruler', tooltip: 'Distance' },
    ]
  }

  onToggleButtons(): void {
    this.store.dispatch(new ToggleButtonTools())
  }

  onClick(action: string) {
    if (action === '3d') {
      this.store.dispatch(new ToggleBuildindsLayer())
    }
  }
}
