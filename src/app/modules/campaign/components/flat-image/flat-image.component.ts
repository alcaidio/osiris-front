import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Picture } from '../../model/shared.model'

@Component({
  selector: 'app-flat-image',
  templateUrl: './flat-image.component.html',
  styleUrls: ['./flat-image.component.scss'],
})
export class FlatImageComponent implements OnChanges {
  @Input() picture: Picture
  @Input() zoom = false
  error = false

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'picture':
            this.error = false
            break
        }
      }
    }
  }

  onError() {
    this.error = true
  }

  onLoaded() {
    // image is loaded
  }
}
