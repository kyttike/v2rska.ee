import {HttpClient} from "aurelia-fetch-client";
import * as moment from "moment";
import {EventAggregator} from "aurelia-event-aggregator";
import {inject, observable} from 'aurelia-framework';
import * as ChartJs from 'chart.js';

@inject(EventAggregator)
export class App {

  ea: EventAggregator;
  api: HttpClient;

  gradient: CanvasGradient = null;
  gradientHeight: number = null;
  gradientWidth: number = null;
  temperature: string = 'Hetkeinfo ei ole kättesaadaval';
  temperature2: string = 'Seda pole ka hetkel olemas';
  temperatureData: any[];
  chartData: any;
  chartLoaded: boolean = false;
  showImage: boolean = false;

  periods: any[] = [
    {
      filterNumber: 5,
      dataPointsCount: 360,
      display: 'Viimased 6 tundi',
    },
    {
      filterNumber: 10,
      dataPointsCount: 720,
      display: 'Viimased 12 tundi'
    },
    {
      filterNumber: 10,
      dataPointsCount: 1440,
      display: 'Viimased 24 tundi',
    },
  ];

  showTemp2 = false;

  @observable selectedPeriod: any;

  constructor(ea) {
    this.ea = ea;

    this.api = new HttpClient();
    let baseUrl = 'https://värska.ee/api/';

    this.api.configure(config => {
      config
        .withBaseUrl(baseUrl);
    });
  }

  activate() {
    if (window.location.search.indexOf('andres') > 0) {
      document.cookie = "showTemp2=true; expires=Fri, 31 Dec 9999 23:59:59 GMT"
    }

    if (document.cookie.split(';').filter(function (item) {
      return item.trim().indexOf('showTemp2=') == 0
    }).length) {
      this.showTemp2 = true;
    }

    this.api.get('temperature')
      .then(result => result.json())
      .then(result => {
        this.temperature = result.temp1 / 10 + '';
        this.temperature2 = result.temp2 / 10 + '';
      })
      .catch(error => console.warn(error));

    return this.api.get('temperatures')
      .then(result => result.json())
      .then(result => this.temperatureData = result.temperatures)
      .catch(error => console.warn(error));
  }

  attached() {
    this.selectedPeriod = this.periods[0];
    const temporaryApi = new HttpClient();
    temporaryApi.get('/dist/static/img/image.jpg')
      .then(res => this.showImage = res.ok)
  }

  calculateGraphData() {
    let temperatures = this.temperatureData;
    temperatures = temperatures.slice(Math.max(temperatures.length - this.selectedPeriod.dataPointsCount, 0));
    temperatures = temperatures.filter((temp, i) => i % (this.selectedPeriod.filterNumber - 1) == 0);
    const data1: ChartJs.ChartDataSets = {
      label: 'Välistemperatuur',
      data: temperatures.map(e => e.temp1 / 10),
      borderColor: (context) => {
        const chartArea = context.chart.chartArea;

        if (!chartArea) {
          return 'rgba(255,99,132,1)';
        }
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;

        if (this.gradient === null || this.gradientWidth !== chartWidth || this.gradientHeight !== chartHeight) {
          this.gradientWidth = chartWidth;
          this.gradientHeight = chartHeight;

          console.log(context)

          let colorChangeOffset = 0.5;
          const yScale: any = context.chart['scales']['y-axis-0'];
          if (yScale.start * yScale.end < 0) {
            const distance = yScale.end - yScale.start
            colorChangeOffset = (distance - yScale.end) / distance
          } else if (yScale.start >= 0) {
            colorChangeOffset = 0
          } else if (yScale.end <= 0) {
            colorChangeOffset = 1
          }
        console.log(colorChangeOffset)

          this.gradient = context.chart.ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          this.gradient.addColorStop(1, 'rgba(255,99,132,1)',)
          this.gradient.addColorStop(Math.min(colorChangeOffset + 0.05, 1), 'rgba(255,99,132,1)',)
          this.gradient.addColorStop(Math.max(colorChangeOffset - 0.05, 0), 'rgb(70,118,255)',)
          this.gradient.addColorStop(0, 'rgb(70,118,255)',)
        }

        return this.gradient;
      },
      backgroundColor: 'rgba(255,135,157,1)',
      borderWidth: 3,
      pointRadius: 0,
      fill: false,
    };
    const data2: ChartJs.ChartDataSets = {
      label: 'Kasvuhoone',
      data: temperatures.map(e => e.temp2 / 10),
      borderColor: 'rgb(0,215,144)',
      backgroundColor: 'rgb(0,232,157)',
      borderWidth: 3,
      pointRadius: 0,
      fill: false,
    };

    this.chartData = {
      type: 'line',
      data: {
        labels: temperatures.map(e => moment(e.time).format('HH:mm')),
        datasets: this.showTemp2 ? [
          data1,
          data2,
        ] : [
          data1
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          intersect: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    };
    if (this.chartLoaded) this.ea.publish('chart:mainGraph:update', this.chartData);
    this.chartLoaded = true;
  }

  selectedPeriodChanged() {
    this.calculateGraphData();
  }
}
