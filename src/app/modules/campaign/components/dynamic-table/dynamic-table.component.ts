import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { MatSelectChange } from '@angular/material/select'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SetActive } from '@ngxs-labs/entity-state'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Calque } from '../../model/shared.model'
import { CalqueState, OverlayState } from '../../store'
import { CloseData } from './../../store/ui/ui.actions'

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[]
  @Output() activeRow = new EventEmitter<number>()
  @ViewChild(MatSort) sort: MatSort
  dataSource: MatTableDataSource<any>
  displayedColumns: string[]
  active: number

  @Select(CalqueState.entities) calques$: Observable<Calque[]>
  @Select(OverlayState.activeId) activeCalque$: Observable<string>

  selectedCalqueName: string

  constructor(private store: Store) {}

  ngOnInit() {
    this.createTable()
    this.activeCalque$.subscribe((activeCalque) => (this.selectedCalqueName = activeCalque))
  }

  ngOnChanges() {
    this.createTable()
    this.sortTable()
  }

  ngAfterViewInit() {
    this.sortTable()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  onClose(): void {
    this.store.dispatch(new CloseData())
  }

  onClickRow(id: number) {
    this.active = id
    this.activeRow.emit(id)
  }

  onChangeActiveCalque(evt: MatSelectChange) {
    const calqueName = evt.value
    // the name of the 'calque' is the same as the name of the corresponding 'overlay'
    this.store.dispatch(new SetActive(OverlayState, calqueName))
  }

  private createTable() {
    this.displayedColumns = Object.keys(this.data[0])
    this.dataSource = new MatTableDataSource(this.data)
  }

  private sortTable() {
    this.dataSource.sort = this.sort
  }
}
