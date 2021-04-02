import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { SetActive } from '@ngxs-labs/entity-state'
import { Select, Store } from '@ngxs/store'
import { MapState, OverlayState } from 'app/modules/campaign/store'
import { Observable } from 'rxjs'
import {
  ChangeModelForCategories,
  ChangeModelForSeries,
  InitCharts,
  SwitchModelForSeriesAndForCategories,
  ToggleStackedBarChart,
} from '../../store'
import { MapSmall, Overlay, TypeModel } from './../../../campaign/model/campaign.model'
import { BarChartState, PieChartState, StatsState } from './../../store/stats.state'

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  @Select(MapState.active) map$: Observable<MapSmall>
  @Select(OverlayState.getActiveOverlay) activeOverlay$: Observable<Overlay>
  @Select(OverlayState.getActiveOverlays) overlays$: Observable<Overlay[]>
  @Select(StatsState.getModels) models$: Observable<TypeModel[]>
  @Select(StatsState.getBarChart) barChart$: Observable<BarChartState>
  @Select(StatsState.getPieChart) pieChart$: Observable<PieChartState>
  @Select(StatsState.getModelForSeries) seriesModel$: Observable<TypeModel>
  @Select(StatsState.getModelForCategories) categoriesModel$: Observable<TypeModel>

  constructor(private store: Store, private location: Location) {}

  ngOnInit(): void {
    // TODO : do overlay switch via mat-select to change data
    this.store.dispatch(new SetActive(OverlayState, '1'))
    const overlay = this.store.selectSnapshot(OverlayState.getActiveOverlay)
    this.store.dispatch(new InitCharts({ overlay }))
  }

  onBack() {
    this.location.back()
  }

  switchModels() {
    this.store.dispatch(new SwitchModelForSeriesAndForCategories())
  }

  onToggleStacked() {
    this.store.dispatch(new ToggleStackedBarChart())
  }

  onChangeSeries(evt: any) {
    const keyName = evt.value
    this.store.dispatch(new ChangeModelForSeries(keyName))
  }

  onChangeCategories(evt: any) {
    const keyName = evt.value
    this.store.dispatch(new ChangeModelForCategories(keyName))
  }

  onChangeOverlay(evt: any) {
    const overlayId = evt.value.toString()
    console.log(overlayId)
    this.store.dispatch(new SetActive(OverlayState, overlayId))
    const overlay = this.store.selectSnapshot(OverlayState.getActiveOverlay)
    this.store.dispatch(new InitCharts({ overlay }))
  }
}
