import { Overlay, TypeModel } from 'app/modules/campaign/model/campaign.model'

export class InitCharts {
  static readonly type = '[Stats] Init charts'
  constructor(public payload: { overlay: Overlay; modelForSeries?: TypeModel; modelForCategories?: TypeModel }) {}
}

export class ChangeModelForCategories {
  static readonly type = '[Stats] Change model for categories'
  constructor(public model: string) {}
}

export class ChangeModelForSeries {
  static readonly type = '[Stats] Change model for series'
  constructor(public model: string) {}
}

export class SwitchModelForSeriesAndForCategories {
  static readonly type = '[Stats] Switch model for series and for categories'
}

export class ToggleStackedBarChart {
  static readonly type = '[Stats] Toggle stacked bar chart'
}
