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


import metadata from 'javascript-api-utils/lib/metadata';
import * as types from './types';
import segments from '../segments';


let NUMERIC_DIMENSIONS = [
  'ga:sessionCount',
  'ga:daysSinceLastSession',
  'ga:sessionDurationBucket',
  'ga:daysToTransaction',
  'ga:year',
  'ga:month',
  'ga:week',
  'ga:day',
  'ga:hour',
  'ga:minute',
  'ga:nthMonth',
  'ga:nthWeek',
  'ga:nthDay',
  'ga:nthHour',
  'ga:nthMinute',
  'ga:isoYear',
  'ga:isoWeek',
];


/**
 * Fetches the metrics and dimensions the user can access based on the passed
 * view data, calculates the sort options based on the current metric and
 * dimension params from the state, and dispatches the `updateSelect2Options()`
 * action creator with the updated data.
 * @param {Object} viewData
 * @return {Function}
 */
export function updateMetricsDimensionsAndSortOptions(viewData) {
  return async function(dispatch, getState) {
    let {account, property, view} = viewData;
    let {params} = getState();
    let {
      metrics,
      dimensions,
      pivotMetrics,
      pivotDimensions,
      cohortMetrics,
      histogramDimensions,
    } = await getMetricsAndDimensionsOptions(account, property, view);

    let sort = getSortOptions(params, metrics, dimensions);

    dispatch(updateSelect2Options({
      metrics,
      dimensions,
      pivotMetrics,
      pivotDimensions,
      cohortMetrics,
      histogramDimensions,
      sort,
    }));
  };
}

/**
 * Gets the current metric and dimension params from the state and updates
 * the sort options by dispatching the `updateSelect2Options()` action creator.
 * @param {Object} viewData
 * @return {Function}
 */
export function updateSortOptions() {
  return function(dispatch, getState) {
    let {params, select2Options: {metrics, dimensions}} = getState();
    let sort = getSortOptions(params, metrics, dimensions);

    dispatch(updateSelect2Options({sort}));
  };
}


/**
 * Fetches the segments the current user can access (by either ID or
 * definition) and dispatches the `updateSelect2Options()` action creator
 * with the updated segments.
 * @param {boolean} useDefinition
 * @return {Function}
 */
export function updateSegmentsOptions(useDefinition) {
  return async function(dispatch) {
    let segments = await getSegmentsOptions(useDefinition);
    dispatch(updateSelect2Options({segments}));
  };
}

/**
 * Returns the UPDATE_SELECT2_OPTIONS action type with the passed
 * select2Options.
 * @param {Object} select2Options
 * @return {Object}
 */
function updateSelect2Options(select2Options) {
  return {type: types.UPDATE_SELECT2_OPTIONS, select2Options};
}

/**
 * Fetches the list of metrics and dimensions the user can access for the
 * passed view and returns a promise resolved with the fetched data.
 * @param {Object} account The account object from the Metadata API.
 * @param {Object} property The property object from the Metadata API.
 * @param {Object} view The view object from the Metadata API.
 * @return {Promise}
 */
function getMetricsAndDimensionsOptions(account, property, view) {
  return Promise.all([
    getMetrics(account, property, view),
    getDimensions(account, property, view),
    getV4Metrics(account, property, view),
    getNumericDimensions(account, property, view),
  ])
  .then(function(data) {
    let metrics = data[0].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group,
      };
    });
    let dimensions = data[1].map(function(dimension) {
      return {
        id: dimension.id,
        name: dimension.attributes.uiName,
        group: dimension.attributes.group,
      };
    });
    let pivotMetrics = data[0].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group,
      };
    });
    let pivotDimensions = data[1].map(function(dimension) {
      return {
        id: dimension.id,
        name: dimension.attributes.uiName,
        group: dimension.attributes.group,
      };
    });
    let cohortMetrics = data[2].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group,
      };
    });
    let histogramDimensions = data[3].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group,
      };
    });
    return {
      metrics,
      dimensions,
      pivotMetrics,
      pivotDimensions,
      cohortMetrics,
      histogramDimensions,
    };
  });
}

/**
 * Accepts the current query params and a list of metrics and dimensions
 * available and returns the possible sort options.
 * @param {Object} params
 * @param {Array} metrics
 * @param {Array} dimensions
 * @return {Array}
 */
function getSortOptions(params, metrics, dimensions) {
  let sortOptions = [];
  let metsAndDims = [...metrics, ...dimensions];
  let chosenMetsAndDims = [
    ...(params.metrics && params.metrics.split(',') || []),
    ...(params.dimensions && params.dimensions.split(',') || []),
  ];

  for (let choice of chosenMetsAndDims) {
    for (let option of metsAndDims) {
      if (choice == option.id) {
        let descending = {...option};
        descending.name += ' (descending)';
        descending.text += ' (descending)';
        descending.id = '-' + choice;

        let ascending = {...option};
        ascending.name += ' (ascending)';
        ascending.text += ' (ascending)';
        ascending.id = choice;

        sortOptions.push(descending);
        sortOptions.push(ascending);
      }
    }
  }
  return sortOptions;
}

/**
 * Fetches all segments the current user can access and returns a promise
 * fulfilled with an array of segment options formatted either by ID
 * or definition (based on the `useDefinition` argument).
 * @param {boolean} useDefinition
 * @return {Promise}
 */
function getSegmentsOptions(useDefinition) {
  return segments.get().then(function(results) {
    let segments = results.map(function(segment) {
      return {
        id: useDefinition ? segment.definition : segment.segmentId,
        name: segment.name,
        group: segment.type == 'BUILT_IN' ?
            'Built in Segment' : 'Custom Segment',
      };
    });

    // Remove the 'All Sessions' segment when using definitions.
    if (useDefinition) segments = segments.slice(1);

    return segments;
  });
}


/**
 * Gets a list of all public, v3 metrics associated with the passed view.
 * @param {Object} account An account object from accountSummaries.list.
 * @param {Object} property A property object from accountSummaries.list.
 * @param {Object} view A view object from accountSummaries.list.
 * @return {Promise} A promise resolved with an array of all public metrics.
 */
function getMetrics(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    return columns.allMetrics((metric, id) => {
      return metric.status == 'PUBLIC' &&
             // TODO(philipwalton): remove this temporary exclusion once
             // caclulated metrics can be templatized using the Management API.
             id != 'ga:calcMetric_<NAME>';
    });
  });
}

/**
 * Gets a list of all public, v4 metrics associated with the passed view.
 * @param {Object} account An account object from accountSummaries.list.
 * @param {Object} property A property object from accountSummaries.list.
 * @param {Object} view A view object from accountSummaries.list.
 * @return {Promise} A promise resolved with an array of all public metrics.
 */
function getV4Metrics(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    return columns.allMetrics((metric, id) => {
      return metric.status == 'PUBLIC' &&
             metric.addedInApiVersion == '4' &&
             // TODO(philipwalton): remove this temporary exclusion once
             // caclulated metrics can be templatized using the Management API.
             id != 'ga:calcMetric_<NAME>';
    });
  });
}

/**
 * Gets a list of all public, v3 dimensions associated with the passed view.
 * @param {Object} account An account object from accountSummaries.list.
 * @param {Object} property A property object from accountSummaries.list.
 * @param {Object} view A view object from accountSummaries.list.
 * @return {Promise} A promise resolved with an array of all public dimensions.
 */
function getDimensions(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    return columns.allDimensions({
      status: 'PUBLIC',
      addedInApiVersion: '3',
    });
  });
}

/**
 * Gets a list of all numeric dimensions associated with the passed view.
 * This could include custom dimensions.
 * @param {Object} account An account object from accountSummaries.list.
 * @param {Object} property A property object from accountSummaries.list.
 * @param {Object} view A view object from accountSummaries.list.
 * @return {Promise} A promise resolved with an array of all public dimensions.
 */
function getNumericDimensions(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    return columns.allDimensions((dimension, id) => {
      return id.match('ga:dimension') || NUMERIC_DIMENSIONS.includes(id);
    });
  });
}
