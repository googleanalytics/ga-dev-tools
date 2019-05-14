// Copyright 2017 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/* global google */

import React, {Component} from 'react';
import styles from './trend-chart.css';
import {loadScript} from '../../../utils';


// The material charts color palette.
const COLORS = [
  '#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1',
  '#FF7043', '#9E9D24', '#5C6BC0', '#F06292', '#00796B', '#C2185B'];


let gvizLoadPromise = null;
const loadGviz = () => {
  return gvizLoadPromise ||
      (gvizLoadPromise = new Promise((resolve, reject) => {
        loadScript('https://www.gstatic.com/charts/loader.js').then(() => {
          google.charts.load('current', {'packages': ['corechart']});
          google.charts.setOnLoadCallback(resolve);
        }, reject);
      }));
};


/**
 * A base chart component that the Aggregate and Breakdown charts extend.
 */
export default class TrendChart extends Component {
  static defaultProps = {className: styles.root};

  state = {}

  /**
   * Handles the window resizing so the chart can be redrawn.
   * Debounces the event to prevent unnecessary redraws.
   */
  handleResize = () => {
    window.clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(this.drawChart, 100);
  }

  /**
   * Draws the chart once the options and datatable values are set.
   */
  drawChart = () => {
    if (this.datatable && this.options) {
      this.chart.draw(this.datatable, this.options);
    }
  }

  /**
   * Sets the chart options and datatable.
   */
  populateChart() {
    this.datatable = google.visualization.arrayToDataTable(this.props.dataset);
    this.options = this.getOptions();
  }

  /**
   * Gets a value form the dataset to ensure appear on the horizontal axis.
   * @return {Array}
   *
   */
  getHAxisTicksFromDataset() {
    return this.props.dataset.slice(1).map((row) => row[0]);
  }

  /**
   * @return {Object}
   */
  getOptions() {
    const options = this.getBaseOptions();

    options.title = this.props.title;
    options.hAxis.ticks = this.getHAxisTicksFromDataset();

    return options;
  }

  /**
   * @return {Object}
   */
  getBaseOptions() {
    return {
      width: '100%',
      height: '100%',
      colors: COLORS,
      interpolateNulls: true,
      fontSize: 12,
      chartArea: {
        width: '100%',
        height: 700,
        top: 100,
        left: 50,
        bottom: 75,
        right: 25,
      },
      titleTextStyle: {
        fontName: 'Arial',
        fontSize: 24,
        bold: false,
      },
      pointSize: 5,
      lineWidth: 3,
      legend: {
        position: 'top',
        alignment: 'start',
      },
      hAxis: {
        baselineColor: 'transparent',
        format: 'none',
        gridlines: {
          count: -1,
          color: 'transparent',
        },
        maxAlternation: 1,
        maxTextLines: 1,
        title: 'Weeks ago',
        titleTextStyle: {
          fontSize: 13,
          bold: true,
          italic: false,
        },
        viewWindow: {min: 0},
      },
      vAxis: {
        format: 'percent',
        gridlines: {
          color: '#eee',
          count: -1,
        },
        textPosition: 'in',
        title: '% of total',
        titleTextStyle: {
          fontSize: 13,
          bold: true,
          italic: false,
        },
        viewWindow: {
          min: 0,
          max: 1,
        },
      },
    };
  }

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /**
   * Handles loading the gviz library and setting the loaded state.
   */
  componentDidMount() {
    loadGviz().then(() => {
      this.chart = new google.visualization.LineChart(this.container);
      this.setState({
        gvizLoaded: true,
        dataset: this.props.dataset,
      });
    });

    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Handles changes to the dataset prop in parent components.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.dataset != nextProps.dataset) {
      this.setState({dataset: nextProps.dataset});
    }
  }

  /**
   * Handles determining if the charts need to be re-rendered.
   * @param {Object} nextProps
   * @param {Object} nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return !!(nextState.gvizLoaded && nextState.dataset != this.state.dataset);
  }

  /**
   * Manually redraws the chart since the component was supposed to update.
   */
  componentDidUpdate() {
    this.populateChart();
    this.drawChart();
  }

  /** @return {Object} The React component. */
  render() {
    return (
      <div
        className={this.props.className}
        ref={(el) => this.container = el} />
    );
  }

  /**
   * Removes event listeners once the components has been destroyed.
   */
  componentWillUnMount() {
    window.removeEventListener('resize', this.handleResize);
  }
}
