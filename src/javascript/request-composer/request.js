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


function buildReportRequest(params) {
  var reportRequest = {
      "viewId": params.viewId,
      "pageSize": params.pageSize,
      "samplingLevel": params.samplingLevel
  };
  return reportRequest;
}

function applyDateRanges(request, params, settings) {
  if (params.startDate &&
      params.endDate &&
      settings.requestType != 'COHORT') {
    request.dateRanges = [{
      "startDate": params.startDate,
      "endDate": params.endDate
    }]
  }
  return request;
}

function applyMetrics(request, params, settings) {
  if (params.metrics &&
      settings.requestType != 'COHORT') {
    request.metrics = [];

    let metrics = params.metrics.split(',');
    for (var i in metrics) {
      request.metrics.push({'expression': metrics[i]});
    }
  } else if (params.cohortMetrics &&
             settings.requestType == 'COHORT') {
    request.metrics = [];

    let metrics = params.cohortMetrics.split(',');
    for (var i in metrics) {
      request.metrics.push({'expression': metrics[i]});
    }
  }
  return request;
}

function applyDimensions(request, params, settings) {
  if (params.dimensions &&
      settings.requestType != 'COHORT') {
    request.dimensions = []

    let dimensions = params.dimensions.split(',');
    for (var i in dimensions) {
      var dimension = {'name': dimensions[i]};
      if (settings.requestType &&
          settings.requestType == 'HISTOGRAM' &&
          params.buckets) {
        var histogramBuckets = [];
        var buckets = params.buckets.split(/[ ,]+/);
        for (var j in buckets) {
          histogramBuckets.push(buckets[j]);
        }
        dimension.histogramBuckets = histogramBuckets;
      }
      request.dimensions.push(dimension);
    }
  } else if (params.cohortSize &&
             settings.requestType == 'COHORT') {
    request.dimensions = [{'name': 'ga:cohort'}];
    switch(params.cohortSize) {
      case 'Day':
        request.dimensions.push({'name': 'ga:NthDay'});
        break;
      case 'Week':
        request.dimensions.push({'name': 'ga:NthWeek'});
        break;
      case 'Month':
        request.dimensions.push({'name': 'ga:NthMonth'});
        break;
    }
  }
  return request;
}

function applySegment(request, params) {
  if (params.segment) {
    request.segments = [{'segmentId': params.segment}];

    // Get current dimensions if they exist otherwise empty list.
    var dimensions = request.dimensions ? request.dimensions : [];

    // Add the `ga:segment` dimension to the list.
    dimensions.push({'name': 'ga:segment'});
    request.dimensions = dimensions;
  }
  return request;
}

function applyOrderBys(request, params, settings) {
  if (params.sort) {
    request.orderBys = [];

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

      if (params.dimensions.indexOf(fieldName) > -1 &&
          settings.requestType &&
          settings.requestType == 'HISTOGRAM') {
        orderBy.orderType = 'HISTOGRAM_BUCKET';
      }
      request.orderBys.push(orderBy);
    }
  }
}

function applyPivotDimensions(pivot, params) {
  if (params.pivotDimensions) {
    pivot.dimensions = []

    let dimensions = params.pivotDimensions.split(',');
    for (var i in dimensions) {
      var dimension = {'name': dimensions[i]};
      pivot.dimensions.push(dimension);
    }
  }
  return pivot;
}

function applyPivotMetrics(pivot, params) {
  if (params.pivotMetrics) {
    pivot.metrics = []

    let metrics = params.pivotMetrics.split(',');
    for (var i in metrics) {
      var metric = {'expression': metrics[i]};
      pivot.metrics.push(metric);
    }
  }
  return pivot;
}

function applyPivots(request, params, settings) {
  if (settings.requestType == 'PIVOT' ) {
    var pivot = {};
    applyPivotDimensions(pivot, params);
    applyPivotMetrics(pivot, params);
    request.pivots = [pivot];
  }
  return request;
}

export function composeRequest(params, settings) {
  if (!params || !settings) {
    return null;
  }
  var reportRequest = buildReportRequest(params);
  applyDateRanges(reportRequest, params, settings);
  applyMetrics(reportRequest, params, settings);
  applyDimensions(reportRequest, params, settings);
  applySegment(reportRequest, params);
  applyOrderBys(reportRequest, params, settings);
  applyPivots(reportRequest, params, settings);
  let request = {'reportRequests': [reportRequest]};
  return request;
}