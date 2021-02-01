import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngxs/store'
import { CheckCalque, ToggleCalque } from '../../store'
import { Calque, GeometryType } from './../../model/shared.model'

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

  generateIcon(type: GeometryType) {
    if (type === 'point') {
      return 'room'
    } else if (type === 'line') {
      return 'timeline'
    } else if (type === 'structure') {
      return 'extension'
    } else {
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
    return this.calque.properties.slice().sort((a, b) => a.name.localeCompare(b.name))
  }
}