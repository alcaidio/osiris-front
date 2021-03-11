import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { Store } from '@ngxs/store'
import { Map } from 'leaflet'
import { OpenViewer } from '../../store'

@Component({
  selector: 'app-popup-content',
  templateUrl: './popup-content.component.html',
  styleUrls: ['./popup-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupContentComponent implements OnInit, OnDestroy {
  @Input() feature: GeoJSON.Feature
  @Input() map: Map
  @Output() add = new EventEmitter<GeoJSON.Feature>()
  @Output() clearSelected = new EventEmitter<void>()
  properties: any[]

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.properties = Object.entries(this.feature.properties)
    // Object.entries(
    //   filteredObjectByKeys(this.feature.properties, this.feature.properties.popupContent)
    // )
  }

  onClickNavigate(): void {
    this.store.dispatch(new OpenViewer())
    const [lng, lat] = this.feature.geometry['coordinates']
    console.log('load image on the point', [lng, lat])
    // setTimeout To 450 because viewer appears completely after 400ms
    setTimeout(() => this.map.invalidateSize({ animate: true }), 500)

    this.map.flyTo([lat, lng])
    setTimeout(() => this.map.closePopup(), 1500)
  }

  ngOnDestroy(): void {
    this.clearSelected.emit()
    // TODO add this to the store and empty the selected layer
  }
}
