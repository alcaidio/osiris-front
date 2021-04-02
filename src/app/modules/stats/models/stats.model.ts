import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts'

export type PieChartOptions = {
  series: ApexNonAxisChartSeries
  chart: ApexChart
  responsive: ApexResponsive[]
  labels: any
  fill: ApexFill
  legend: ApexLegend
  tooltip: ApexTooltip
  colors: string[]
}

export type BarChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  grid: ApexGrid
  dataLabels: ApexDataLabels
  plotOptions: ApexPlotOptions
  xaxis: ApexXAxis
  yaxis: ApexYAxis
  stroke: ApexStroke
  title: ApexTitleSubtitle
  tooltip: ApexTooltip
  fill: ApexFill
  legend: ApexLegend
}
