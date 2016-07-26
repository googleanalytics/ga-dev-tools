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


var NUMERIC_DIMENSIONS = [
  {
    'attributes': {
      'group': 'User',
      'uiName': 'Session Count',
    },
    'id': 'ga:sessionCount'
  },
    {
    'attributes': {
      'group': 'User',
      'uiName': 'Days Since Last Session',
    },
    'id': 'ga:daysSinceLastSession'
  },
  {
    'attributes': {
      'group': 'Session',
      'uiName': 'Session Duration Bucket',
    },
    'id': 'ga:sessionDurationBucket'
  },
  {
    'attributes': {
      'Group': 'Ecommerce',
      'uiName': 'Days to transaction',
    },
    'id': 'ga:daysToTransaction'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Year',
    },
    'id': 'ga:year'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'month',
    },
    'id': 'ga:month'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'week',
    },
    'id': 'ga:week'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Day',
    },
    'id': 'ga:day'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Hour',
    },
    'id': 'ga:hour'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Minute',
    },
    'id': 'ga:minute'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Nth Month',
    },
    'id': 'ga:nthMonth'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Nth Week',
    },
    'id': 'ga:nthWeek'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'NthDay',
    },
    'id': 'ga:nthDay'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Nth Hour',
    },
    'id': 'ga:nthHour'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'Nth Minute',
    },
    'id': 'ga:nthMinute'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'ISO Year',
    },
    'id': 'ga:isoYear'
  },
  {
    'attributes': {
      'group': 'Time',
      'uiName': 'ISO Week',
    },
    'id': 'ga:isoWeek'
  }
]

export function updateMetricsDimensionsAndSortOptions(viewData) {
  return async function(dispatch, getState) {
    let {account, property, view} = viewData;
    let {params} = getState();
    let {metrics, dimensions,
         pivotMetrics, pivotDimensions,
         cohortMetrics} = await getMetricsAndDimensionsOptions(
        account, property, view);

    let sort = getSortOptions(params, metrics, dimensions);

    dispatch(updateSelect2Options({metrics, dimensions, pivotMetrics, pivotDimensions, cohortMetrics, sort}));
  };
}


export function updateSortOptions() {
  return async function(dispatch, getState) {
    let {params, select2Options: {metrics, dimensions}} = getState();
    let sort = getSortOptions(params, metrics, dimensions);

    dispatch(updateSelect2Options({sort}));
  };
}


export function updateSegmentsOptions(useDefinition) {
  return async function(dispatch) {
    let segments = await getSegmentsOptions(useDefinition);
    dispatch(updateSelect2Options({segments}));
  };
}


function updateSelect2Options(select2Options) {
  return {type: types.UPDATE_SELECT2_OPTIONS, select2Options};
}


function getMetricsAndDimensionsOptions(account, property, view) {
  return Promise.all([
    getMetrics(account, property, view),
    getDimensions(account, property, view)
  ])
  .then(function(data) {
    let metrics = data[0].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group
      };
    });
    let dimensions = data[1].map(function(dimension) {
      return {
        id: dimension.id,
        name: dimension.attributes.uiName,
        group: dimension.attributes.group
      };
    });
    let pivotMetrics = data[0].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group
      };
    });
    let pivotDimensions = data[1].map(function(dimension) {
      return {
        id: dimension.id,
        name: dimension.attributes.uiName,
        group: dimension.attributes.group
      };
    });
    let cohortMetrics = data[0].map(function(metric) {
      return {
        id: metric.id,
        name: metric.attributes.uiName,
        group: metric.attributes.group
      };
    });
    return {metrics, dimensions, pivotMetrics, pivotDimensions, cohortMetrics};
  });
}


function getSortOptions(params, metrics, dimensions) {

  let sortOptions = [];
  let metsAndDims = [...metrics, ...dimensions];
  let chosenMetsAndDims = [
    ...(params.metrics && params.metrics.split(',') || []),
    ...(params.dimensions && params.dimensions.split(',') || [])
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


function getSegmentsOptions(useDefinition) {
  return segments.get().then(function(results) {
    let segments = results.map(function(segment) {
      return {
        id: useDefinition ? segment.definition : segment.segmentId,
        name: segment.name,
        group: segment.type == 'BUILT_IN' ?
            'Built in Segment' : 'Custom Segment'
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
             // calulated metrics can be templatized using the Management API.
             id != 'ga:calcMetric_<NAME>';
    });
  });
}



/**
 * Gets a list of all public dimensions associated with the passed view.
 * @param {Object} account An account object from accountSummaries.list.
 * @param {Object} property A property object from accountSummaries.list.
 * @param {Object} view A view object from accountSummaries.list.
 * @return {Promise} A promise resolved with an array of all public dimensions.
 */
function getDimensions(account, property, view) {

  return metadata.getAuthenticated(account, property, view).then((columns) => {
    return columns.allDimensions({
        status: 'PUBLIC',
      });
  });
}