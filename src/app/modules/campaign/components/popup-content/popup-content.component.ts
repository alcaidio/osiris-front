import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { Store } from '@ngxs/store'
import { Map } from 'leaflet'
import { Overlay } from '../../model/campaign.model'
import { OpenViewer } from '../../store'
import { transformKeyAndValue } from './../../utils/shared.utils'

@Component({
  selector: 'app-popup-content',
  templateUrl: './popup-content.component.html',
  styleUrls: ['./popup-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupContentComponent implements OnInit, OnDestroy {
  @Input() feature: GeoJSON.Feature
  @Input() map: Map
  @Input() overlay: Overlay

  @Output() add = new EventEmitter<GeoJSON.Feature>()
  @Output() clearSelected = new EventEmitter<void>()
  properties: any[]

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.properties = Object.entries(this.feature.properties)
      .filter((f) => f[0] !== 'diag_id' && f[0] !== 'gid')
      .map((prop) => transformKeyAndValue(prop[0], prop[1], this.overlay.featureTypeModel))
  }

  onClickNavigate(): void {
    this.store.dispatch(new OpenViewer())
    const [lng, lat] = this.feature.geometry['coordinates']
    console.log('load image on the point', [lng, lat])
    // setTimeout To 450 because viewer appears completely after 400ms
    setTimeout(() => this.map && this.map.invalidateSize({ animate: true }), 500)

    this.map.flyTo([lat, lng])
    setTimeout(() => this.map.closePopup(), 1500)
  }

  ngOnDestroy(): void {
    this.clearSelected.emit()
    // TODO add this to the store and empty the selected layer
  }
}
