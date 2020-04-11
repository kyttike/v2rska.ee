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
  temperature2: string = 'Seda pole ka hetkel olemas';
  temperatureData: any[];
  chartData: any;
  chartLoaded: boolean = false;

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
    let baseUrl = environment.samePort ? '/api/' : 'http://localhost:3000/api/';

    this.api.configure(config => {
      config
        .withBaseUrl(baseUrl);
    });
  }

  activate(params) {
    if (window.location.search.indexOf('andres') > 0) {
      document.cookie = "showTemp2=true; expires=Fri, 31 Dec 9999 23:59:59 GMT"
    }

    if (document.cookie.split(';').filter(function(item) {
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
  }

  calculateGraphData() {
    let temperatures = this.temperatureData;
    temperatures = temperatures.slice(Math.max(temperatures.length - this.selectedPeriod.dataPointsCount, 0));
    temperatures = temperatures.filter((temp, i) => i % (this.selectedPeriod.filterNumber - 1) == 0);
    const data1 = {
      label: 'Välistemperatuur',
      data: temperatures.map(e => e.temp1 / 10),
      borderColor: 'rgba(255,99,132,1)',
      backgroundColor: 'rgba(255,135,157,1)',
      borderWidth: 3,
      pointRadius: 0,
      fill: false,
    };
    const data2 =           {
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
