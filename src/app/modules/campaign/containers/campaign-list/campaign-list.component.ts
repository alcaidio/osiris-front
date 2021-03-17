import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Select } from '@ngxs/store'
import { ConfigState } from 'app/core/store'
import moment from 'moment'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { Campaign } from '../../model/shared.model'
import { CampaignsState } from '../../store/campaigns/campaigns.state'

@AutoUnsubscribe()
@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Select(CampaignsState.entities) campaigns$: Observable<Campaign[]>
  @Select(CampaignsState.loading) isLoading$: Observable<boolean>
  @Select(ConfigState.getNavigationLoad) navigationLoad$: Observable<boolean>

  // @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  dataSource: MatTableDataSource<Campaign>
  campaignsTableColumns = ['title', 'creationDate', 'lastUpdate']

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

    // paginator pas util pour le moment
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage()
    // }
  }

  fromNow(time: number) {
    const duration = new Date(time)
    return moment(duration, 'YYYYMMDD').locale('fr').fromNow()
  }

  getDate(time: number) {
    const duration = new Date(time)
    return moment(duration).locale('fr').format('Do MMMM, YYYY')
  }

  onAddCampaign() {
    // TODO add campaign action workflow
    console.log('add campaign')
  }

  private sortAndPagine() {
    // this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  ngOnDestroy(): void {
    // Don't remove !
    // here because of AutoUnsubscrive() above the component decorator.
  }
}
