import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Select } from '@ngxs/store'
import moment from 'moment'
import { Observable } from 'rxjs'
import { Campaign } from '../../model/shared.model'
import { CampaignsState } from '../../store/campaigns/campaigns.state'

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent implements OnInit, AfterViewInit {
  @Select(CampaignsState.entities) campaigns$: Observable<Campaign[]>
  @Select(CampaignsState.loading) isLoading$: Observable<boolean>

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  dataSource: MatTableDataSource<Campaign>
  campaignsTableColumns = ['title', 'creationDate', 'editionDate']

  ngOnInit(): void {
    this.campaigns$.subscribe((campaigns) => {
      this.dataSource = new MatTableDataSource(campaigns)
      this.sortAndPagine()
    })
  }

  ngAfterViewInit() {
    this.sortAndPagine()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  fromNow(time: number) {
    const duration = new Date(time)
    return moment(duration, 'YYYYMMDD').locale('fr').fromNow()
  }

  getDate(time: number) {
    const duration = new Date(time)
    return moment(duration).locale('fr').format('Do MMMM, YYYY')
  }

  private sortAndPagine() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
}
