import { Component, Input } from '@angular/core'
import { Store } from '@ngxs/store'
import { Calque, PropertyType, PropertyValue } from '../../model/campaign.model'
import { CheckValue } from '../../store'

@Component({
  selector: 'app-property-value',
  templateUrl: './property-value.component.html',
  styleUrls: ['./property-value.component.scss'],
})
export class PropertyValueComponent {
  @Input() value: PropertyValue
  @Input() property: PropertyType
  @Input() calque: Calque

  truncateTo = 20

  constructor(private store: Store) {}

  onCheck(value: PropertyValue, property: PropertyType, calque: Calque) {
    this.store.dispatch(new CheckValue({ value, property, calque }))
  }

  get displayName() {
    return this.value.displayName.toLowerCase()
  }
}
