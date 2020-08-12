import { Component, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { TreoAnimations } from '@treo/animations'
import { Observable } from 'rxjs'
import { ChangeMapStyle, ToggleButtonStyle, UIState } from '../store'

@Component({
  selector: 'app-switch-map-style',
  animations: TreoAnimations,
  template: `
    <div class="absolute left-0 z-99" style="top: 83%">
      <div class="relative ml-4">
        <div class="flex items-center justify-center">
          <div
            class="flex items-center justify-center h-10 w-10 mr-4 bg-cool-gray-400 cursor-pointer rounded-full shadow-lg rotate"
            (click)="onClick()"
          >
            <mat-icon class="icon-size-20 text-white z-50" [svgIcon]="'feather:map'"></mat-icon>
          </div>
          <ng-container *ngIf="isOpen$ | async">
            <div
              *ngFor="let style of styles"
              class="mr-3 bg-cool-gray-100 cursor-pointer rounded-full shadow-lg z-10"
              (click)="switchStyle(style.id)"
              [matTooltipPosition]="'above'"
              [matTooltip]="style.tooltip"
              @slideInLeft
              @zoomOut
            >
              <img class="h-10 w-10 rounded-full" [src]="style.image" />
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
export class SwitchMapStyleComponent implements OnInit {
  @Select(UIState.getButtonStyle) isOpen$: Observable<boolean>
  styles: { id: string; image: string; tooltip: string }[]

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.styles = [
      {
        id: 'mapbox://styles/mapbox/outdoors-v11',
        image: 'assets/images/topografic-map.png',
        tooltip: 'Topografic map',
      },
      { id: 'mapbox://styles/mapbox/streets-v11', image: 'assets/images/light-map.png', tooltip: 'Light map' },
      { id: 'mapbox://styles/mapbox/satellite-v9', image: 'assets/images/satellite-map.png', tooltip: 'Satellite map' },
      { id: 'mapbox://styles/mapbox/dark-v10', image: 'assets/images/dark-map.png', tooltip: 'Dark map' },
    ]
  }

  onClick() {
    this.store.dispatch(new ToggleButtonStyle())
  }

  switchStyle(style: string): void {
    this.store.dispatch(new ChangeMapStyle(style))
  }
}
