import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Store } from '@ngxs/store'
import { cleanString } from '../../utils'
import { Overlay } from './../../model/campaign.model'
import { UpdateFeature } from './../../store/overlays/overlays.actions'

interface DialogData {
  prop: { propName: string; propValue: string }
  feature: GeoJSON.Feature
  overlay: Overlay
}

// TODO : It's for a section but it can be dynamic
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  values: any
  initialSelected: string
  value: string

  propertyKeyName = 'PLCO_ROAD_SECTION_STATE'

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store
  ) {}

  ngOnInit(): void {
    const models = this.data.overlay.featureTypeModel.find((e) => e.keyName === this.propertyKeyName)
    this.initialSelected = models.propertyValues.find(
      (p) => cleanString(p.displayName) === cleanString(this.data.prop.propValue)
    ).keyName
    this.values = models.propertyValues
  }

  onModelChange(evt: any) {
    this.value = evt.value
  }

  onClick() {
    const featureId = this.data.feature.properties.gid
    const overlayId = this.data.overlay.id
    const organizationPropertyKeyName = this.propertyKeyName
    const params = { featureId, overlayId, organizationPropertyKeyName, value: this.value }
    this.store.dispatch(new UpdateFeature(params))
  }

  // private updateFeature(featureId: string, overlayId: ID, value: string) {
  //   this.store.dispatch(
  //     new Update(
  //       OverlayState,
  //       (e) => e.id === overlayId,
  //       (e) => {
  //         const feature = e.features.find((f) => f.id === featureId)
  //         const featureUpdated = { ...feature, properties: { ...feature.properties, plco_road_section_state: value } }
  //         return { ...e, features: { ...e.features, featureUpdated } }
  //       }
  //     )
  //   )
  // }
}
