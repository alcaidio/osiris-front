import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngxs/store'
import { CloseData } from './../../store/ui/ui.actions'

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[]
  dataSource: MatTableDataSource<any>
  displayedColumns: string[]
  @ViewChild(MatSort) sort: MatSort

  constructor(private store: Store) {}

  ngOnInit() {
    this.createTable()
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

  private createTable() {
    this.displayedColumns = Object.keys(this.data[0])
    this.dataSource = new MatTableDataSource(this.data)
  }

  private sortTable() {
    this.dataSource.sort = this.sort
  }
}
