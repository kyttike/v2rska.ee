import {inject, bindable} from 'aurelia-framework';
import * as ChartJs from 'chart.js';
import {EventAggregator, Subscription} from "aurelia-event-aggregator";

@inject(EventAggregator)
export class ChartJsChart {

  ea: EventAggregator;
  chart: ChartJs;

  constructor(ea) {
    this.ea = ea;
  }

  container; // from view
  @bindable chartName;
  @bindable chartOptions;

  updateSubscription: Subscription;

  attached() {
    this.updateSubscription = this.ea.subscribe(`chart:${this.chartName}:update`, this.updateChart.bind(this));
    this.chart = new ChartJs.Chart(this.container, this.chartOptions);
  }

  detached() {
    this.updateSubscription.dispose();
  }

  updateChart(newOptions) {
    this.chart.destroy();
    this.chartOptions = newOptions;
    this.chart = new ChartJs.Chart(this.container, this.chartOptions);
  }
}

// https://stackoverflow.com/questions/42696138/create-chart-in-spaaurelia-with-mvvm-pattern
