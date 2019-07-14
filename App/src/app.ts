import {HttpClient} from "aurelia-fetch-client";
import environment from './environment';
import * as moment from "moment";

export class App {

  temperature: string = 'Hetkeinfo ei ole kättesaadaval';
  chartData: any;
  chartLoaded: boolean = false;

  activate() {
    const client = new HttpClient();
    const baseurl = environment.samePort ? '/api/' : 'http://localhost:3000/api/';
    console.log(baseurl);
    client.configure(config => {
      config
        .withBaseUrl(baseurl);
    });

    client.get('temperature')
      .then(result => result.json())
      .then(result => this.temperature = result.temperature / 10 + '')
      .catch(error => console.warn(error));

    client.get('temperatures')
      .then(result => result.json())
      .then(result => this.drawGraph(result));
  }

  drawGraph(data) {
    console.log(data.temperatures);
    let temperatures = data.temperatures.length > 10 ? data.temperatures.filter((temp, i) => i % 5 == 4) : data.temperatures;
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
    console.log(this.chartData);
    this.chartLoaded = true;
  }
}
