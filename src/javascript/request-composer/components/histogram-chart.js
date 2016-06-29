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

const CHART_OPTIONS = {
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

var FILL_COLOR = ["rgba(220,220,220,0.5)", "rgba(151,187,205,0.5)"];
var STROKE_COLOR = ["rgba(220,220,220,0.8)", "rgba(151,187,205,0.8)"];
var HIGHLIGHT_FILL = ["rgba(220,220,220,0.75)", "rgba(151,187,205,0.75)"];
var HIGHLIGHT_STROKE = ["rgba(220,220,220,1)", "rgba(151,187,205,1)"];

export function createResults(report) {
    // Parses the report and creates a chartData object.

    if (!report.data) {
        return;
    }

    var labels = [];
    var datasets = [];
    if (report.data.rows && report.data.rows.length) {
        var metricheaders = report.columnHeader.metricHeader.metricHeaderEntries;
        for (var i=0, header; header = metricheaders[i]; ++i) {
            datasets.push({
                label: header.name,
                fillColor: FILL_COLOR[i%2],
                strokeColor: STROKE_COLOR[i%2],
                highlightFill: HIGHLIGHT_FILL[i%2],
                highlightStroke: HIGHLIGHT_STROKE[i%2],
                data: []
            });
        }

        for (var rowIndex=0, row; row = report.data.rows[rowIndex]; ++rowIndex) {
            var metricValues = row.metrics[0].values;
            for (var i=0, value; value = metricValues[i]; ++i) {
                datasets[i].data.push(value);
            }
            labels.push(row.dimensions[0]);
        }
    }

    var foo = {labels: labels, datasets: datasets};
    return foo;
};

export default class BarChart extends React.Component {
  render() {
    let {response} = this.props;
    let data = createResults(response.result.reports[0]);
    return (
        <Bar data={data} options={CHART_OPTIONS} width="600" height="250" redraw/>
    );
  }
};


