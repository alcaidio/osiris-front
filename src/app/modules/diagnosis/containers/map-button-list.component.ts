import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { NotificationService } from 'app/shared/services/notification.service'
import { ChangeBaseLayer } from '../store'
import { ButtonMapItem } from './../../../shared/models/maps.model'
import { mapBaseLayers } from './../data/map.config'

@Component({
  selector: 'app-map-button-list',
  template: `
    <div class="absolute left-0 z-99" style="top: 75%">
      <div class="relative ml-4">
        <!-- <app-map-button [iconFirst]="'feather:tool'" [items]="mapTools" (action)="onAction($event)"></app-map-button> -->
      </div>
    </div>
    <div class="absolute left-0 z-99" style="top: 83%">
      <div class="relative ml-4">
        <app-map-button
          [iconFirst]="'feather:map'"
          [items]="mapBaseLayers"
          [isImage]="true"
          (action)="onAction($event)"
        ></app-map-button>
      </div>
    </div>
  `,
})
export class MapButtonListComponent implements OnInit {
  // mapTools: ButtonMapItem[]
  mapBaseLayers: ButtonMapItem[]

  constructor(private store: Store, private notification: NotificationService) {}

  ngOnInit(): void {
    // this.mapTools = mapTools
    this.mapBaseLayers = mapBaseLayers // TODO : put this config in store
  }

  onAction(item: ButtonMapItem) {
    switch (item.action) {
      case 'changeBaseLayer':
        this.store.dispatch(new ChangeBaseLayer(item.id))
        break
      default:
        this.notification.openSnackBar(`Pas d'action disponible`)
        break
    }
  }
}
