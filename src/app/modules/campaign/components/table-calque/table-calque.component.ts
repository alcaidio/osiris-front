import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-table-calque',
  styleUrls: ['table-calque.component.scss'],
  templateUrl: 'table-calque.component.html',
})
export class TableCalqueComponent implements AfterViewInit, OnChanges {
  @Input() data: any
  displayedColumns: string[]
  dataSource: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  constructor() {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.data)
    this.displayedColumns = Object.keys(this.data[0])
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }
}
