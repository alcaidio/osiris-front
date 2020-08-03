import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Router } from '@angular/router'
import { Layer, MapMouseEvent } from 'mapbox-gl'
import { MapComponent } from 'ngx-mapbox-gl'
import { Observable, Subscription } from 'rxjs'
import { DiagService } from '../services/diag.service'

@Component({
  selector: 'app-map',
  styleUrls: ['./map.component.scss'],
  template: `
    <div class="content-layout right-sidebar-fullheight-basic-inner-scroll">
      <mat-drawer-container>
        <!-- Drawer -->
        <mat-drawer [mode]="'side'" [position]="'end'" [disableClose]="true" [opened]="false" #matDrawer>
          <router-outlet></router-outlet>
        </mat-drawer>

        <mat-drawer-content>
          <mgl-map
            #mapbox
            [style]="'mapbox://styles/mapbox/outdoors-v9'"
            [zoom]="11"
            [maxBounds]="[4, 45.7, 4.5, 46.7]"
            [center]="[4.28596, 46.28486]"
            [pitch]="0"
            [bearing]="0"
            (click)="onClick($event)"
          >
            <mgl-control
              mglGeocoder
              [proximity]="[4.28596, 46.28486]"
              [bbox]="[4, 46, 4.5, 46.5]"
              placeholder="Search"
              position="top-right"
            ></mgl-control>
            <mgl-control mglFullscreen position="top-left"></mgl-control>
            <mgl-control mglNavigation position="top-left"></mgl-control>
            <mgl-control mglScale position="bottom-right"></mgl-control>

            <ng-container *ngFor="let layer of layers$ | async; trackBy: trackByFn">
              <mgl-layer [id]="layer.id" [type]="layer.type" [source]="layer.source"></mgl-layer>
            </ng-container>
          </mgl-map>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class CustomMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapbox', { static: true }) map: MapComponent
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer
  layers$: Observable<Layer[]>
  private subs = new Subscription()

  constructor(private diagService: DiagService, private router: Router) {}

  ngOnInit(): void {
    this.layers$ = this.diagService.getLayers()
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.subs.add(
        this.diagService.getSectionIdByLngLat({ lng, lat }).subscribe((id) => {
          this.router.navigate(['map/sections', id])
        })
      )
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
