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

const DEFAULT_REQUEST =

{
  "reportRequests": 
  [
    {
      "viewId": "1174",
      "dateRanges": 
      [
        {
          "startDate": "2015-01-01",
          "endDate": "2015-02-01"
        }
      ],
      "dimensions": [],
      "metrics": 
      [
        {
          "expression": "ga:sessions"
        }
      ],
      "orderBys": 
      [
        {
          "fieldName": "ga:sessionCount",
          "orderType": "HISTOGRAM_BUCKET"
        }
      ]
    }
  ]
};

export function composeRequest(params) {
  console.log(params);
  
  var template = DEFAULT_REQUEST;
  template.reportRequests[0].viewId = params.viewId;
  template.reportRequests[0].dateRanges[0].startDate = params.startDate;
  template.reportRequests[0].dateRanges[0].endDate = params.endDate;


  // Handle the dimensions field.
  if (params.dimensions) {
    // Clear the dimensions.
    template.reportRequests[0].dimensions = [];

    // Get the dimensions from the model and populate the dimensions array.
    let dimensions = params.dimensions.split(',');
    for (var i in dimensions) {

      var dimension = {'name': dimensions[i]}

      if (params.buckets) {
        var histogramBuckets = [];
        var buckets = params.buckets.split(',');
        for (var j in buckets) {
          histogramBuckets.push(buckets[j]);
        }
        dimension.histogramBuckets = histogramBuckets;
      }
      template.reportRequests[0].dimensions.push(dimension);
    }
  } else {
    delete template.reportRequests[0].dimensions;
  }

  // Handle the metrics field.
  if (params.metrics) {
    // Clear the metrics.
    template.reportRequests[0].metrics = []

    // Get the metrics from the model and populate the metrics array.
    let metrics = params.metrics.split(',');
    for (var i in metrics) {
      template.reportRequests[0].metrics.push({'expression': metrics[i]});
    }
  } else {
    delete template.reportRequests[0].metrics;
  }

  // Handle the segment parameter.
  if (params.segment) {
    // Clear the segment definition.
    template.reportRequests[0].segments = [];

    // Get the segment from the model and populate the segments array.
    template.reportRequests[0].segments = [{'segmentId': params.segment}];
    // Add the ga:segment dimension.
    if (template.reportRequests[0].dimensions) {
      template.reportRequests[0].dimensions.push({'name': 'ga:segment'});
    } else {
      template.reportRequests[0].dimensions = {'name': 'ga:segment'};
    }
  } else {
    delete template.reportRequests[0].segments
  }

  // Handle the sort (OrderBys) parameter.
  if (params.sort) {
    // Clear the orderBys definition.
    template.reportRequests[0].orderBys = [];

    // Get the dimsmets from the model and populate the orderBys array.
    let dimsmets = params.sort.split(',');
    for (var i in dimsmets) {
      var orderBy = {};
      var fieldName = dimsmets[i];

      if (fieldName[0] == '-') {
        fieldName = fieldName.substring(1);
        orderBy.sortOrder = 'DESCENDING';
      } else {
        orderBy.sortOrder = 'ASCENDING';
      }
      orderBy.fieldName = fieldName;

      // Check if this is dimension.
      if (params.dimensions.indexOf(fieldName) > -1) {
        // It is a dimension.
        orderBy.orderType = 'HISTOGRAM_BUCKET';
      }

      template.reportRequests[0].orderBys.push(orderBy);
    }
  }

  return template;
}