import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-map-details',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/map.component.scss'],
  template: `
  <ng-container *transloco="let t">
      <app-map-drawer [title]="'Map details'" [autoOpen]="false">
        TODO
      </app-map-drawer>
    </ng-container>
  `
})
export class MapDetailsComponent {}
