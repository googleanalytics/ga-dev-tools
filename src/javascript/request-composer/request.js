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

import moment from 'moment';


/**
 * Builds a the top level Analytics Reporting API V4
 * ReportRequest object, and sets all the top level
 * fields.
 * @param {Object} params The request composer's parameters object.
 * @return {Object} The Report Request Object.
 */
function buildReportRequest(params) {
  let reportRequest = {
      viewId: params.viewId,
      samplingLevel: params.samplingLevel,
  };
  if (params.filters) {
    reportRequest.filtersExpression = params.filters;
  }
  if (params.includeEmptyRows) {
    if (params.includeEmptyRows.toLowerCase() == 'true') {
      reportRequest.includeEmptyRows = 'true';
    } else if (params.includeEmptyRows.toLowerCase() == 'false') {
      reportRequest.includeEmptyRows = 'false';
    }
  }
  if (params.pageSize &&
      parseInt(params.pageSize)) {
    reportRequest.pageSize = params.pageSize;
  }
  if (params.pageToken) {
    reportRequest.pageToken = params.pageToken;
  }
  return reportRequest;
}

/**
 * Applies the DateRange object to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Report Request object.
 */
function applyDateRanges(request, params, settings) {
  if (params.startDate &&
      params.endDate &&
      settings.requestType != 'COHORT') {
    request.dateRanges = [{
      startDate: params.startDate,
      endDate: params.endDate
    }];
  }
  return request;
}

/**
 * Applies the metric objects to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {object} The Report Request object.
 */
function applyMetrics(request, params, settings) {
  if (params.metrics &&
      settings.requestType != 'COHORT') {
    request.metrics = [];

    let metrics = params.metrics.split(',');
    for (let metric of metrics) {
      request.metrics.push({'expression': metric});
    }
  } else if (params.cohortMetrics &&
             settings.requestType == 'COHORT') {
    request.metrics = [];

    let metrics = params.cohortMetrics.split(',');
    for (let metric of metrics) {
      request.metrics.push({'expression': metric});
    }
  }
  return request;
}

/**
 * Applies the Dimension objects to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Report Request object.
 */
function applyDimensions(request, params, settings) {
  if (settings.requestType != 'COHORT' &&
      (params.histogramDimensions || params.dimensions)) {
    request.dimensions = [];
    let dimensions = [];
    if (settings.requestType == 'HISTOGRAM' &&
        params.histogramDimensions) {
      dimensions = params.histogramDimensions.split(',');
    } else if (params.dimensions) {
      dimensions = params.dimensions.split(',');
    } else {
      return request;
    }
    for (let name of dimensions) {
      let dimension = {name: name};
      if (settings.requestType &&
          settings.requestType == 'HISTOGRAM' &&
          params.buckets) {
        let histogramBuckets = [];
        let buckets = params.buckets.split(/\s*,\s*/);
        for (let bucket of buckets) {
          histogramBuckets.push(bucket);
        }
        dimension.histogramBuckets = histogramBuckets;
      }
      request.dimensions.push(dimension);
    }
  } else if (params.cohortSize &&
             settings.requestType == 'COHORT') {
    request.dimensions = [{name: 'ga:cohort'}];
    switch(params.cohortSize) {
      case 'Day':
        request.dimensions.push({name: 'ga:cohortNthDay'});
        break;
      case 'Week':
        request.dimensions.push({name: 'ga:cohortNthWeek'});
        break;
      case 'Month':
        request.dimensions.push({name: 'ga:cohortNthMonth'});
        break;
    }
  }
  return request;
}

/**
 * Applies the segment objects to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Report Request object.
 */
function applySegment(request, params, settings) {
  if (settings.requestType != 'COHORT' && params.segment) {
    request.segments = [{segmentId: params.segment}];

    // Get current dimensions if they exist otherwise empty list.
    let dimensions = request.dimensions ? request.dimensions : [];

    // Add the `ga:segment` dimension to the list.
    dimensions.push({name: 'ga:segment'});
    request.dimensions = dimensions;
  }
  return request;
}

/**
 * Applies the OrderBy objects to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Report Request object.
 */
function applyOrderBys(request, params, settings) {

  if (settings.requestType == 'COHORT') {
    request.orderBys = [{fieldName: 'ga:cohort'}];
    return request;
  } else if (settings.requestType == 'HISTOGRAM') {
    if (request.dimensions) {
      request.orderBys = [
        {
          fieldName: request.dimensions[0].name,
          orderType: 'HISTOGRAM_BUCKET',
          sortOrder: 'ASCENDING'
        }
      ];
    }
  } else if (params.sort) {
    request.orderBys = [];

    let dimsmets = params.sort.split(',');
    for (let fieldName of dimsmets) {
      let orderBy = {};

      if (fieldName[0] == '-') {
        fieldName = fieldName.substring(1);
        orderBy.sortOrder = 'DESCENDING';
      } else {
        orderBy.sortOrder = 'ASCENDING';
      }
      orderBy.fieldName = fieldName;
      request.orderBys.push(orderBy);
    }
    return request;
  }
}

/**
 * Applies the Dimensions objects to the Pivot object.
 * @param {Object} pivot The pivot object.
 * @param {Object} params The Request Composer parameters.
 * @returns {Object} The pivot object.
 */
function applyPivotDimensions(pivot, params) {
  if (params.pivotDimensions) {
    pivot.dimensions = [];

    let dimensions = params.pivotDimensions.split(',');
    for (let dimension of dimensions) {
      pivot.dimensions.push({'name': dimension});
    }
  }
  return pivot;
}

/**
 * Applies the Metric objects to the Pivot object.
 * @param {Object} pivot The pivot object.
 * @param {Object} params The Request Composer parameters.
 * @returns {Object} The pivot object.
 */
function applyPivotMetrics(pivot, params) {
  if (params.pivotMetrics) {
    pivot.metrics = [];

    let metrics = params.pivotMetrics.split(',');
    for (let metric of metrics) {
      pivot.metrics.push({expression: metric});
    }
  }
  return pivot;
}

/**
 * Applies the Pivot objects to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Report Request object.
 */
function applyPivots(request, params, settings) {
  if (settings.requestType == 'PIVOT' ) {
    let pivot = {};
    applyPivotDimensions(pivot, params);
    applyPivotMetrics(pivot, params);
    if (params.maxGroupCount) {
      pivot.maxGroupCount = params.maxGroupCount;
    }
    if (params.startGroup) {
      pivot.startGroup = params.startGroup;
    }
    request.pivots = [pivot];
  }
  return request;
}

/**
 * Applies the Cohort objects to the Report Request object.
 * @param {Object} request The report request object.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Report Request object.
 */
function applyCohorts(request, params, settings) {
  if (settings.requestType == 'COHORT') {
    let now = moment();
    let cohorts = [];
    switch(params.cohortSize) {
      case 'Day':
        // Create cohorts for the past seven days.
        for(let i = 0; i < 7; i++) {
          now = now.subtract(1, 'days');
          let cohort = {
            type: 'FIRST_VISIT_DATE',
            name: now.format('YYYY-MM-DD'),
            dateRange: {
              startDate: now.format('YYYY-MM-DD'),
              endDate: now.format('YYYY-MM-DD')
            }
          };
          cohorts.push(cohort);

        }
        break;
      case 'Week':
        // Create cohorts for the past 6 weeks.
        for(let i = 0; i < 6; i++) {
            let startDate = now.subtract(1,
              'week').startOf('week').format('YYYY-MM-DD');
            let endDate = now.endOf('week').format('YYYY-MM-DD');
            let cohort = {
              type: 'FIRST_VISIT_DATE',
              name: startDate + ' to ' + endDate,
              dateRange: {
                startDate: startDate,
                endDate: endDate
              }
          };
          cohorts.push(cohort);
        }
        break;
      case 'Month':
        // Create cohorts for the past 3 months.
        for(let i = 0; i < 3; i++) {
            let startDate = now.subtract(1,
              'month').startOf('month').format('YYYY-MM-DD');
            let endDate = now.endOf('month').format('YYYY-MM-DD');
            let cohort = {
              type: 'FIRST_VISIT_DATE',
              name: startDate + ' to ' + endDate,
              dateRange: {
                startDate: startDate,
                endDate: endDate
              }
            };
            cohorts.push(cohort);
        }
        break;
    }
    request.cohortGroup = {'cohorts': cohorts};
  }
  return request;
}

/**
 * Composes the body of an Analytics Reporting API V4 request.
 * @param {Object} params The Request Composer parameters.
 * @param {Object} settings The Request Composer settings.
 * @returns {Object} The Analytics Reporting API V4 request.
 */
export function composeRequest(params, settings) {
  if (!params || !settings) {
    return null;
  }
  let reportRequest = buildReportRequest(params);
  applyDateRanges(reportRequest, params, settings);
  applyMetrics(reportRequest, params, settings);
  applyDimensions(reportRequest, params, settings);
  applySegment(reportRequest, params, settings);
  applyOrderBys(reportRequest, params, settings);
  applyPivots(reportRequest, params, settings);
  applyCohorts(reportRequest, params, settings);
  let request = {'reportRequests': [reportRequest]};
  return request;
}

const code = new RegExp('("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|'+
  '\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)', 'g');

/**
 * Highlights the JSON syntax
 * @param {Object|String} json The JSON object to highlight.
 * @return {String} The highlighted JSON string.
 */
export function syntaxHighlight(json) {
    if (!json) {
      return;
    }
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;');
    json = json.replace(/</g, '&lt;');
    json = json.replace(/>/g, '&gt;');
    return json.replace(code, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}