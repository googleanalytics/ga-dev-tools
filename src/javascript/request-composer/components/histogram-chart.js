// Copyright 2016 Google Inc. All rights reserved.
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


import React from 'react';
import {Bar} from 'react-chartjs';

const CHART_OPTIONS = {
    // Boolean - Whether the scale should start at zero.
    scaleBeginAtZero: true,

    // Boolean - Whether grid lines are shown across the chart.
    scaleShowGridLines: true,

    // String - Colour of the grid lines.
    scaleGridLineColor: 'rgba(0,0,0,.05)',

    // Number - Width of the grid lines
    scaleGridLineWidth: 1,

    // Boolean - Whether to show horizontal lines (except X axis).
    scaleShowHorizontalLines: true,

    // Boolean - Whether to show vertical lines (except Y axis).
    scaleShowVerticalLines: true,

    // Boolean - If there is a stroke on each bar.
    barShowStroke: true,

    // Number - Pixel width of the bar stroke.
    barStrokeWidth: 2,

    // Number - Spacing between each of the X value sets.
    barValueSpacing: 5,

    // Number - Spacing between data sets within X values.
    barDatasetSpacing: 1,

    // String - A legend template.
    legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><%' +
      'for (var i=0; i<datasets.length; i++){%><li><span' +
        'style="background-color:<%=datasets[i].fillColor%>"></span>' +
        '<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
};

let FILL_COLOR = ['rgba(250,137,79,0.5)',
                  'rgba(179,191,205,0.5)',
                  'rgba(240,206,147,0.5)',
                  'rgba(74,86,109,0.5)',
                  'rgba(108,128,167,0.5)'];
let STROKE_COLOR = ['rgba(250,137,79,0.8)',
                    'rgba(179,191,205,0.8)',
                    'rgba(240,206,147,0.5)',
                    'rgba(74,86,109,0.8)',
                    'rgba(108,128,167,0.8)'];
let HIGHLIGHT_FILL = ['rgba(250,137,79,0.75)',
                      'rgba(179,191,205,0.75)',
                      'rgba(240,206,147,0.5)',
                      'rgba(74,86,109,0.75)',
                      'rgba(108,128,167,0.75)'];
let HIGHLIGHT_STROKE = ['rgba(250,137,79,1)',
                        'rgba(179,191,205,1)',
                        'rgba(240,206,147,0.5)',
                        'rgba(74,86,109,1)',
                        'rgba(108,128,167,1)'];


/**
 * Create the histogram chart data.
 * @param {Object} report The Analytics Reporting API v4 Report object.
 * @return {Object} The histogram chart.
 */
export function createChartData(report) {
    // Parses the report and creates a chartData object.

    if (!report.data) {
        return;
    }

    let labels = [];
    let datasets = [];
    if (report.data.rows && report.data.rows.length) {
        let headers = report.columnHeader.metricHeader.metricHeaderEntries;
        for (let i=0, header; header = headers[i]; ++i) {
            datasets.push({
                label: header.name,
                fillColor: FILL_COLOR[i%5],
                strokeColor: STROKE_COLOR[i%5],
                highlightFill: HIGHLIGHT_FILL[i%5],
                highlightStroke: HIGHLIGHT_STROKE[i%5],
                data: [],
            });
        }

        for (let j=0, row; row = report.data.rows[j]; ++j) {
            let metricValues = row.metrics[0].values;
            for (let i=0, value; value = metricValues[i]; ++i) {
                datasets[i].data.push(value);
            }
            labels.push(row.dimensions[0]);
        }
    }

    return {labels: labels, datasets: datasets};
}


/**
 * A components that renders the histogram visualization.
 */
export default class HistogramChart extends React.Component {

  /** @return {Object} The React component. */
  render() {
    let {response} = this.props;
    let data = createChartData(response.result.reports[0]);
    if (data.labels.length) {
      return (
          <Bar data={data} options={CHART_OPTIONS} width="600" height="250"/>
      );
    } else {
      return (
          <h2>No data in response</h2>
      );
  }
  }
}


