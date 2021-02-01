import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Store } from '@ngxs/store'
import { Calque, CalqueProperty } from '../../model/shared.model'
import { CheckProperty, ToggleProperty } from '../../store'
import { cleanString } from './../../utils/shared.utils'

@Component({
  selector: 'app-property-type',
  templateUrl: './property-type.component.html',
  styleUrls: ['./property-type.component.scss'],
})
export class PropertyTypeComponent {
  @Input() property: CalqueProperty
  @Input() calque: Calque

  @Output() check = new EventEmitter<boolean>()
  @Output() toggle = new EventEmitter<boolean>()

  truncateTo = 20

  constructor(private store: Store) {}

  onToggleExpanded(value: boolean) {
    this.property.toggled = !value
    this.toggle.emit(value)
  }

  get propertiesSortByName() {
    return this.property.values.slice().sort((a, b) => a.name.localeCompare(b.name))
  }

  get currentStyle() {
    return cleanString(this.calque.legend) === cleanString(this.property.name)
  }

  onToggle(property: CalqueProperty, calque: Calque) {
    this.store.dispatch(new ToggleProperty({ property, calque }))
  }

  onCheck(property: CalqueProperty, calque: Calque) {
    this.store.dispatch(new CheckProperty({ property, calque }))
  }
}
