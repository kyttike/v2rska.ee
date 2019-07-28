import {HttpClient} from "aurelia-fetch-client";
import environment from './environment';
import * as moment from "moment";
import {EventAggregator} from "aurelia-event-aggregator";
import {inject, observable} from 'aurelia-framework';

@inject(EventAggregator)
export class App {

  ea: EventAggregator;
  api: HttpClient;

  temperature: string = 'Hetkeinfo ei ole kättesaadaval';
  temperatureData: any[];
  chartData: any;
  chartLoaded: boolean = false;

  periods: any[] = [
    {
      filterNumber: 5,
      dataPointsCount: 60,
      display: 'Viimane tund',
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
  @observable selectedPeriod: any;

  constructor(ea) {
    this.ea = ea;

    this.api = new HttpClient();
    let baseUrl = environment.samePort ? '/api/' : 'http://localhost:3000/api/';

    baseUrl = 'http://värska.ee/api/';

    this.api.configure(config => {
      config
        .withBaseUrl(baseUrl);
    });
  }

  activate() {
    this.api.get('temperature')
      .then(result => result.json())
      .then(result => this.temperature = result.temperature / 10 + '')
      .catch(error => console.warn(error));

    return this.api.get('temperatures')
      .then(result => result.json())
      .then(result => this.temperatureData = result.temperatures)
      .catch(error => console.warn(error));
  }

  attached() {
    this.selectedPeriod = this.periods[0];
  }

  calculateGraphData() {
    let temperatures = this.temperatureData;
    temperatures = temperatures.slice(Math.max(temperatures.length - this.selectedPeriod.dataPointsCount, 0));
    temperatures = temperatures.filter((temp, i) => i % (this.selectedPeriod.filterNumber - 1) == 0);
    this.chartData = {
      type: 'line',
      data: {
        labels: temperatures.map(e => moment(e.time).format('HH:mm')),
        datasets: [{
          label: 'Temperatuur',
          data: temperatures.map(e => e.temperature / 10),
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,135,157,1)',
          borderWidth: 3,
          pointRadius: 0,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    };
    this.chartLoaded = true;
    this.ea.publish('chart:mainGraph:update', this.chartData)
  }

  selectedPeriodChanged() {
    this.calculateGraphData();
  }
}
