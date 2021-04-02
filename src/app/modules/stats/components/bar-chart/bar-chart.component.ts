import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts'
import { BarChartOptions } from '../../models/stats.model'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() series: ApexAxisChartSeries
  @Input() categories: string[]
  @Input() colors: string[]
  @Input() stacked = true

  @ViewChild('chart') chart: ChartComponent
  public chartOptions: Partial<BarChartOptions>

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      series: this.series,
      chart: {
        type: 'bar',
        height: this.stacked ? this.categories.length * 100 : this.categories.length * 150,
        width: '100%',
        stacked: this.stacked,
      },
      grid: {
        show: true,
        borderColor: '#dcdcdc',
        strokeDashArray: 4,
        position: 'back',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 10,
          right: 0,
          bottom: 10,
          left: 0,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '75%',
          dataLabels: {
            orientation: 'horizontal',
          },
        },
      },
      dataLabels: {
        style: {
          fontSize: '10px',
        },
      },
      title: {
        text: ' ',
      },
      xaxis: {
        categories: this.categories,
        title: {
          text: undefined,
        },
        labels: {
          formatter: (val) => {
            return val + ' km'
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return val + ' km'
          },
        },
      },
      fill: {
        opacity: 1,
        colors: this.colors,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'right',
        markers: {
          fillColors: this.colors,
        },
      },
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.series.length !== this.categories.length || this.series.length !== this.colors.length) {
      console.warn('Component input problem ! Inputs must be the same length.')
    }
    if (this.chart) {
      for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
          switch (propName) {
            case 'series':
              this.chart.updateSeries(this.series)
              break
            case 'categories':
              const { series, ...others } = this.chartOptions
              this.chart.updateOptions(others)
              break
            case 'stacked':
              this.chart.updateOptions(this.chartOptions)
              this.chart.render()
              break
          }
        }
      }
    }
  }
}
