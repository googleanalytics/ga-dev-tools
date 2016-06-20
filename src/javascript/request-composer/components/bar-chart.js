// Copyright 2015 Google Inc. All rights reserved.
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


/* global gapi */


import React from 'react';
import { Bar } from 'react-chartjs';
import AlertDispatcher from '../../components/alert-dispatcher';


var chartOptions = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

};

var chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

export function createResults(report) {
    // Parses the report and creates a chartData object.
    var labels = [];
    var dataset = {
            label: null,
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
        };
    if (!report.data) {
        return;
    }
    if (report.data.rows && report.data.rows.length) {
        var metricheaders = report.columnHeader.metricHeader.metricHeaderEntries;
        dataset.label = metricheaders[0];
        for (var rowIndex=0, row; row = report.data.rows[rowIndex]; ++rowIndex) {
            var values = row.metrics[0].values;
            dataset.data.push(values[0]);
            labels.push(row.dimensions[0]);
        }
    }
    var foo = {labels: labels, datasets: [dataset]};
    return foo;
}

export default class BarChartComponent extends React.Component {
  render() {
    let {response} = this.props;
    //checkHttpResponseCode(response);
    if (response.status > 200) {
        AlertDispatcher.addOnce({
        title: 'Oops, there bad access error',
        message: response.result.error.message
       });
      return (
          <div>
            <h2>Query Results</h2>
            <pre
              dangerouslySetInnerHTML={{__html: response.result.error.message}}>
            </pre>
          </div>
          );
    } else if (response.status == 200) {
      let data = createResults(response.result.reports[0]);
      return (
        <div>
          <h2>Query Results</h2>
          <Bar data={data} options={chartOptions} width="600" height="250" redraw/>
        </div>
      );
    }
    return (
      <div>
        <h2>Query Results</h2>
        <Bar data={chartData} options={chartOptions} width="600" height="250"/>
      </div>
    );
  }
}


