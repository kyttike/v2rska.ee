import {containerless, bindable} from 'aurelia-framework';
import * as ChartJs from 'chart.js';

@containerless()
export class ChartJsChart {

  container; // from view
  @bindable chartOptions;

  attached() {
    new ChartJs.Chart(this.container, this.chartOptions);
  }
}

// https://stackoverflow.com/questions/42696138/create-chart-in-spaaurelia-with-mvvm-pattern
