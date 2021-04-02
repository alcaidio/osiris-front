import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { Overlay, TypeModel } from 'app/modules/campaign/model/campaign.model'
import { cleanString } from 'app/modules/campaign/utils'
import { pallette } from '../utils/colors'
import { round, transformDataForApexChart } from './../utils/chart'
import {
  ChangeModelForCategories,
  ChangeModelForSeries,
  InitCharts,
  SwitchModelForSeriesAndForCategories,
  ToggleStackedBarChart,
} from './stats.actions'

// TODO : create a store with entity manager from ngxs plugin to manage multiple widget that contain chart..
// because here it's like this only 2 graphics exist while there may be other

export interface BarChartState {
  data: {
    series: { name: string; data: any[] }[] | null
    categories: string[] | null
    colors: string[] | null
  }
  params: {
    stacked: boolean
    /// add some params from apexcharts if is necessary
  }
}

export interface PieChartState {
  data: {
    labels: string[] | null
    series: number[] | null
    colors: string[] | null
  }
  // params: {}
}

export interface StatsStateModel {
  overlay: Overlay | null
  models: TypeModel[] | null
  modelForSeries: TypeModel | null
  modelForCategories: TypeModel | null
  barChart: BarChartState
  pieChart: PieChartState
}

const statsStateDefaults: StatsStateModel = {
  overlay: null,
  models: null,
  modelForSeries: null,
  modelForCategories: null,
  barChart: {
    data: {
      series: null,
      categories: null,
      colors: null,
    },
    params: {
      stacked: true,
    },
  },
  pieChart: {
    data: {
      labels: null,
      series: null,
      colors: null,
    },
  },
}

@State<StatsStateModel>({
  name: 'stats',
  defaults: statsStateDefaults,
})
@Injectable()
export class StatsState {
  @Selector()
  static getModelForCategories(state: StatsStateModel): TypeModel {
    return state.modelForCategories
  }

  @Selector()
  static getModelForSeries(state: StatsStateModel): TypeModel {
    return state.modelForSeries
  }

  @Selector()
  static getOverlay(state: StatsStateModel): Overlay {
    return state.overlay
  }

  @Selector()
  static getModels(state: StatsStateModel): TypeModel[] {
    return state.models
  }

  @Selector()
  static getBarChart(state: StatsStateModel): BarChartState {
    return state.barChart
  }

  @Selector()
  static getPieChart(state: StatsStateModel): PieChartState {
    return state.pieChart
  }

  @Action(ToggleStackedBarChart)
  toggleStackedBarChart({ patchState, getState }: StateContext<StatsStateModel>) {
    patchState({
      barChart: {
        ...getState().barChart,
        params: {
          stacked: !getState().barChart.params.stacked,
        },
      },
    })
  }

  @Action(ChangeModelForCategories)
  changeModelForCategories(
    { patchState, getState, dispatch }: StateContext<StatsStateModel>,
    action: ChangeModelForCategories
  ) {
    const { overlay, modelForSeries, modelForCategories, models } = getState()
    patchState({
      modelForCategories: models.find((m) => cleanString(m.keyName) === cleanString(action.model)),
    })
    dispatch(new InitCharts({ overlay, modelForSeries, modelForCategories }))
  }

  @Action(ChangeModelForSeries)
  changeModelForSeries(
    { patchState, getState, dispatch }: StateContext<StatsStateModel>,
    action: ChangeModelForSeries
  ) {
    const { overlay, modelForSeries, modelForCategories, models } = getState()
    patchState({
      modelForSeries: models.find((m) => cleanString(m.keyName) === cleanString(action.model)),
    })
    dispatch(new InitCharts({ overlay, modelForSeries, modelForCategories }))
  }

  @Action(SwitchModelForSeriesAndForCategories)
  switchModelForSeriesAndForCategories({ patchState, getState, dispatch }: StateContext<StatsStateModel>) {
    const { overlay, modelForSeries, modelForCategories } = getState()
    patchState({
      modelForSeries: modelForCategories,
      modelForCategories: modelForSeries,
    })
    dispatch(new InitCharts({ overlay, modelForSeries: modelForCategories, modelForCategories: modelForSeries }))
  }

  @Action(InitCharts)
  initCharts({ patchState }: StateContext<StatsStateModel>, action: InitCharts) {
    const { overlay, modelForSeries, modelForCategories } = action.payload

    // TODO : add date and number type
    // Get accepte model for data
    const models = overlay.featureTypeModel.filter((e) => e.propertyType === 'enum' && e.propertyValues.length > 0)

    // Get slected key for bar chart
    let propKeyForSeries = null
    let propKeyForCat = null

    if (!modelForSeries || !modelForCategories) {
      if (models.length >= 2) {
        propKeyForSeries = models[1].keyName.toLowerCase()
        propKeyForCat = models[0].keyName.toLowerCase()
      } else {
        // TODO : UI alternative, not enought available data for stats
        console.warn('Not enought models for charts data')
      }
    } else {
      propKeyForSeries = modelForSeries.keyName.toLowerCase()
      propKeyForCat = modelForCategories.keyName.toLowerCase()
    }

    // Tranform overlay data for apex charts
    const data = transformDataForApexChart(overlay, propKeyForSeries, propKeyForCat)

    // Convert propKey of series in displayName
    const seriesModel = models.find((m) => cleanString(m.keyName) === cleanString(propKeyForSeries)).propertyValues
    const seriesConverted = data.series.map((s) => {
      return { ...s, name: seriesModel.find((c) => cleanString(c.keyName) === cleanString(s.name)).displayName }
    })

    // Convert propKey of categories
    const categoriesModel = models.find((m) => cleanString(m.keyName) === cleanString(propKeyForCat)).propertyValues
    const categoriesConverted = data.categories.map((categorie: string) => {
      return categoriesModel.find((c) => cleanString(c.keyName) === cleanString(categorie)).displayName
    })

    // Get color pallette, it depend of series length
    const colors = pallette.teal[seriesConverted.length].colors

    patchState({
      overlay: overlay,
      models: models,
      modelForSeries: modelForSeries ? modelForSeries : models[1],
      modelForCategories: modelForCategories ? modelForCategories : models[0],
      barChart: {
        data: {
          series: seriesConverted,
          categories: categoriesConverted,
          colors: colors,
        },
        params: {
          stacked: true,
        },
      },
      pieChart: {
        data: {
          labels: seriesConverted.map((s) => s.name),
          series: seriesConverted.map((serie) => round(serie.data.reduce((acc, curr) => acc + curr, 0))),
          colors: colors,
        },
      },
    })
  }
}
