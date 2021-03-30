import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SetActive } from '@ngxs-labs/entity-state'
import { Store } from '@ngxs/store'
import { Calque, GeomType } from '../../model/campaign.model'
import { CalqueState, CheckCalque, OverlayState, ToggleCalque, ToggleData } from '../../store'
import { DialogComponent } from '../dialog/dialog.component'

@Component({
  selector: 'app-calque',
  templateUrl: './calque.component.html',
  styleUrls: ['./calque.component.scss'],
})
export class CalqueComponent implements OnInit {
  @Input() calque: Calque

  truncateTo: number

  constructor(private store: Store, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.truncateTo = 18
  }

  generateIcon(type: GeomType) {
    switch (type.toLowerCase()) {
      case 'linestring':
      case 'multilinestring':
        return 'timeline'
      case 'point':
        return 'room'
      case 'polygon':
      case 'multipolygon':
        return 'timeline'
      default:
        throw new Error('Cant load icon layer !')
    }
  }

  onToggle(calque: Calque) {
    this.store.dispatch(new ToggleCalque(calque))
  }

  onCheck(calque: Calque) {
    this.store.dispatch(new CheckCalque(calque))
  }

  get propertiesSortByName() {
    return this.calque.properties.slice().sort((a, b) => a.displayName.localeCompare(b.displayName))
  }

  onActive(id: string) {
    this.store.dispatch(new SetActive(OverlayState, id))
    this.store.dispatch(new SetActive(CalqueState, id))
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      minWidth: '300px',
      minHeight: '350px',
      data: this.calque.properties,
    })
  }

  openOverlayData() {
    // the name of the 'calque' is the same as the name of the corresponding 'overlay'
    this.store.dispatch(new ToggleData())
  }
}
