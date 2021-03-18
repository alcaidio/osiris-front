import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { Calque } from '../../model/campaign.model'
import { CalqueState, OverlayState } from '../../store'
import { CheckCalque } from './../../store/calques/calques.actions'
import { CloseData } from './../../store/ui/ui.actions'

AutoUnsubscribe()
@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() data: any[]
  @Output() activeRow = new EventEmitter<string>()
  @ViewChild(MatSort) sort: MatSort
  dataSource: MatTableDataSource<any>
  displayedColumns: string[]
  active: number

  // normally the component has no direct data via the store. Thereafter the data must only pass through the inputs
  @Select(CalqueState.entities) calques$: Observable<Calque[]>
  @Select(CalqueState.getActive) calque$: Observable<Calque>
  @Select(OverlayState.getActiveOverlayFeatures) notFilteredFeatures$: Observable<any>
  @Select(OverlayState.activeId) activeCalque$: Observable<string>

  selectedCalqueId: string

  constructor(private store: Store) {}

  ngOnInit() {
    this.createTable()
    this.activeCalque$.subscribe((activeCalque) => (this.selectedCalqueId = activeCalque))
  }

  ngOnChanges() {
    this.createTable()
    this.sortTable()
  }

  ngAfterViewInit() {
    setTimeout(() => this.sortTable(), 150)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  onClose(): void {
    this.store.dispatch(new CloseData())
  }

  onClickRow(row: any) {
    this.active = row.id
    this.activeRow.emit(row.featureId)
  }

  onChangeActiveCalque(evt: MatSelectChange) {
    const calqueId = evt.value
    // the name of the 'calque' is the same as the name of the corresponding 'overlay'
    this.store.dispatch(new SetActive(OverlayState, calqueId))
    this.store.dispatch(new SetActive(CalqueState, calqueId))
  }

  onRemoveFilters(calque: Calque): void {
    this.store.dispatch(new CheckCalque(calque))
  }

  private createTable() {
    if (this.data && this.data.length > 0) {
      this.displayedColumns = Object.keys(this.data[0]).filter((i) => i !== 'featureId') // remove featureId it's just for find feature for fitbound
      this.dataSource = new MatTableDataSource(this.data)
    }
  }

  private sortTable() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort
    }
  }

  ngOnDestroy(): void {
    // Don't remove !
    // here because of AutoUnsubscrive() above the component decorator.
  }
}
