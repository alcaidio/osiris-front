import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Map } from 'leaflet'
import { Overlay } from '../../model/campaign.model'
import { AlertComponent } from '../alert/alert.component'
import { transformKeyAndValue } from './../../utils/shared.utils'

@Component({
  selector: 'app-popup-content',
  templateUrl: './popup-content.component.html',
  styleUrls: ['./popup-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupContentComponent implements OnInit, OnDestroy {
  @Input() feature: GeoJSON.Feature
  @Input() map: Map
  @Input() overlay: Overlay
  @Output() clearSelected = new EventEmitter<void>()
  properties: any[]

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.properties = Object.entries(this.feature.properties)
      .filter((f) => f[0] !== 'diag_id' && f[0] !== 'gid')
      .map((prop) => transformKeyAndValue(prop[0], prop[1], this.overlay.featureTypeModel))
  }

  onClick(obj: { propName: string; propValue: string }) {
    this.dialog.open(AlertComponent, {
      data: { prop: obj, feature: this.feature, overlay: this.overlay },
    })
    this.map.closePopup()
  }

  ngOnDestroy(): void {
    this.clearSelected.emit()
    // TODO add this to the store and empty the selected layer
  }
}
