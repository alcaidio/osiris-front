import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Component, Input } from '@angular/core'
import { CreateOrReplace, RemoveAll } from '@ngxs-labs/entity-state'
import { Store } from '@ngxs/store'
import { Calque } from '../../model/shared.model'
import { CalqueState } from '../../store'

@Component({
  selector: 'app-calque-list',
  templateUrl: './calque-list.component.html',
  styleUrls: ['./calque-list.component.scss'],
})
export class CalqueListComponent {
  @Input() calques: Calque[]

  constructor(private store: Store) {}

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    this.store.dispatch(new RemoveAll(CalqueState))
    this.store.dispatch(new CreateOrReplace(CalqueState, event.container.data))
  }
}
