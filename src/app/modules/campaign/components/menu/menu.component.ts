import { Component } from '@angular/core'
import { Store } from '@ngxs/store'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(private store: Store) {}

  // filterByProperty(prop: string) {
  //   this.store.dispatch(
  //     new Update(
  //       OverlayState,
  //       (e) => e.features.filter(f => f.properties.hasOwnProperty(prop)) as any
  //       { done: true } // set them done
  //     )
  //   )
  // }
}
