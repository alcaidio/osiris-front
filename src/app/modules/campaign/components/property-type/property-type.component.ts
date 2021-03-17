import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Store } from '@ngxs/store'
import { Calque, PropertyType } from '../../model/campaign.model'
import { CheckProperty, ToggleProperty } from '../../store'

@Component({
  selector: 'app-property-type',
  templateUrl: './property-type.component.html',
  styleUrls: ['./property-type.component.scss'],
})
export class PropertyTypeComponent {
  @Input() property: PropertyType
  @Input() calque: Calque

  @Output() check = new EventEmitter<boolean>()
  @Output() toggle = new EventEmitter<boolean>()

  truncateTo = 20

  constructor(private store: Store) {}

  onToggleExpanded(value: boolean) {
    this.property.toggled = !value
    this.toggle.emit(value)
  }

  get propertiesSortByOrder() {
    return this.property.values.slice().sort((a, b) => {
      return a.order - b.order
    })
  }

  get isActiveStyle() {
    return this.property.activeStyle
  }

  get name() {
    return this.property.displayName.toLowerCase()
  }

  onToggle(property: PropertyType, calque: Calque) {
    this.store.dispatch(new ToggleProperty({ property, calque }))
  }

  onCheck(property: PropertyType, calque: Calque) {
    this.store.dispatch(new CheckProperty({ property, calque }))
  }
}
