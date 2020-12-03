import { Component, OnDestroy, ViewEncapsulation } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Map } from 'mapbox-gl'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { BaseMap, Drawer, MapConfig } from '../../shared/models'
import { Overlay } from './../../shared/models/maps.model'
import { Section } from './models/section.model'
import { BaseMapState, LoadSection, SetMapConfig, UIState } from './store'
import { SectionState } from './store/section/section.state'

AutoUnsubscribe()
@Component({
  selector: 'app-diagnosis',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./diagnosis.component.scss'],
  template: `
    <app-template-two [drawer]="drawer$ | async">
      <ng-container sidenav>
        <router-outlet></router-outlet>
      </ng-container>
      <ng-container content>
        <app-sidenav-toggle *ngIf="(section$ | async) || (overlays$ | async)"></app-sidenav-toggle>
        <app-map-menu></app-map-menu>
        <app-map-button-list></app-map-button-list>
        <app-mapbox
          *ngIf="baseMap$ | async as map"
          [baselayers]="map.baselayers"
          [config]="map.config"
          [overlays]="map.overlays"
          [section]="section$ | async"
          (mapConfig)="setMapConfig($event)"
          (getSection)="getSection($event)"
          (getMapInstance)="mapInstance = $event"
        ></app-mapbox>
      </ng-container>
    </app-template-two>
  `,
})
export class DiagnosisComponent implements OnDestroy {
  @Select(BaseMapState.getMap) baseMap$: Observable<BaseMap>
  @Select(UIState.getDrawer) drawer$: Observable<Drawer>
  // TODO : template load bones -> @Select(BaseMapState.getLoading) isLoading$: Observable<boolean>
  @Select(SectionState.getSelectedSection) section$: Observable<Section>
  @Select(BaseMapState.getOverlays) overlays$: Observable<Overlay[]>

  mapInstance: Map

  constructor(private store: Store) {}

  setMapConfig(evt: Partial<MapConfig>) {
    this.store.dispatch(new SetMapConfig(evt))
  }

  getSection(evt: GeoJSON.Position) {
    this.store.dispatch(new LoadSection(evt)).pipe(take(1))
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}
