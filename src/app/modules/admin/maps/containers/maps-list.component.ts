import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { MapCard } from './../models/maps.model'
import { MapListService } from './../services/map-list.service'

@Component({
  selector: 'app-maps-list',
  template: `
    <!-- TODO: add i18n -->
    <div class="content-layout fullwidth-standard-content-scroll">
      <div class="header">
        <div class="left">
            <h1>Cartothèque</h1>
        </div>
        <div class="right">
          <button mat-stroked-button [color]="'primary'" [matMenuTriggerFor]="mapListAction">
              <span class="xs:hidden">Action</span>
              <mat-icon class="icon-size-18 ml-3" [svgIcon]="'keyboard_arrow_down'"></mat-icon>
          </button>
          <mat-menu #mapListAction xPosition="before">
            <!-- TODO: add actions -->
              <button mat-menu-item (click)="true">
                  <span>Action 1</span>
                  <mat-icon class="ml-6 mr-0 icon-size-18" [svgIcon]="'check'"></mat-icon>
              </button>
              <button mat-menu-item (click)="true">
                  <span>Action 2</span>
                  <mat-icon class="ml-6 mr-0 icon-size-18" [svgIcon]="'check'"></mat-icon>
              </button>
              <button mat-menu-item (click)="true">
                  <span>Action 3</span>
                  <mat-icon class="ml-6 mr-0 icon-size-18" [svgIcon]="'check'"></mat-icon>
              </button>
          </mat-menu>
        </div>
      </div>
      <div class="main">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4 xl:gap-10">
          <ng-container *ngFor="let card of cards$ | async">
            <app-map-item [card]="card"></app-map-item>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class MapsListComponent implements OnInit {
  cards$: Observable<MapCard[]>

  constructor(private service: MapListService) { }

  ngOnInit(): void {
    this.cards$ = this.service.getMapCardList()
  }

}
