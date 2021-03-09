import { Component, Input } from '@angular/core'
import { Store } from '@ngxs/store'
import { Calque, PropertyValue } from '../../model/shared.model'
import { CheckValue } from '../../store'
import { PropertyType } from './../../model/shared.model'

@Component({
  selector: 'app-property-value',
  templateUrl: './property-value.component.html',
  styleUrls: ['./property-value.component.scss'],
})
export class PropertyValueComponent {
  @Input() value: PropertyValue
  @Input() property: PropertyType
  @Input() calque: Calque

  truncateTo = 12

  constructor(private store: Store) {}

  onCheck(value: PropertyValue, property: PropertyType, calque: Calque) {
    this.store.dispatch(new CheckValue({ value, property, calque }))
  }

  get name() {
    return this.value.name.toLowerCase()
  }
}
