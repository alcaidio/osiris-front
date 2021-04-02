import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core'
import { ApexNonAxisChartSeries, ChartComponent } from 'ng-apexcharts'
import { PieChartOptions } from '../../models/stats.model'

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() series: ApexNonAxisChartSeries
  @Input() labels: string[]
  @Input() colors: string[]

  @ViewChild('chart') chart: ChartComponent
  chartOptions: Partial<PieChartOptions>

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      series: this.series,
      colors: this.colors,
      chart: {
        width: '90%',
        type: 'pie',
      },
      labels: this.labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'left',
            },
          },
        },
      ],
      fill: {
        opacity: 1,
        colors: this.colors,
      },
      legend: {
        markers: {
          fillColors: this.colors,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return val + ' km'
          },
        },
        marker: {
          show: true,
          fillColors: this.colors,
        },
        fillSeriesColor: true,
      },
    }
  }

  ngOnChanges(): void {
    if (this.series.length !== this.labels.length) {
      console.warn('Component input problem ! Series and labels must be the same length.')
    }

    if (this.series.length !== this.colors.length) {
      console.warn('Component input problem ! Series and colors must be the same length.')
    }
  }
}
