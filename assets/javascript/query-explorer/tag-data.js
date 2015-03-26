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


import metadata from 'javascript-api-utils/lib/metadata';


/**
 * Returns a promise that is resolved with an array of all public metrics.
 * @return {goog.Promise}
 */
function getMetricTags() {
  return metadata.get().then(function(columns) {
    return columns.allMetrics('public');
  });
}


/**
 * Returns a promise that is resolved with an array of all public dimensions.
 * @return {goog.Promise}
 */
function getDimensionTags() {
  return metadata.get().then(function(columns) {
    return columns.allDimensions('public');
  });
}


/**
 * Returns a promise that is resolved with an array of all segments this user
 * can access.
 * @return {goog.Promise}
 */
function getSegmentTags(useDefinition = false) {
  return gapi.client.analytics.management.segments
      .list().then(function(response) {
    return response.result.items;
  });
}


/**
 * Returns a promise that is resolved with an object of metrics, dimensions,
 * segment IDs, and segment definitions in the form that select2 needs them.
 * @return {Promise}
 */
export default function() {
  return Promise.all([
    getMetricTags(),
    getDimensionTags(),
    getSegmentTags()
  ])
  .then(function(data) {
    return {

      metrics: data[0].map(function(metric) {
        return {
          id: metric.id,
          text: [metric.id, metric.uiName, metric.group].join(' '),
          name: metric.attributes.uiName,
          group: metric.attributes.group
        };
      }),

      dimensions: data[1].map(function(dimension) {
        return {
          id: dimension.id,
          text: [dimension.id, dimension.uiName, dimension.group].join(' '),
          name: dimension.attributes.uiName,
          group: dimension.attributes.group
        };
      }),

      segmentIds: data[2].map(function(segment) {
        return {
          id: segment.segmentId,
          text: [segment.definition, segment.name, segment.type].join(' '),
          segmentId: segment.segmentId,
          definition: segment.definition,
          name: segment.name,
          group: segment.type == 'BUILT_IN' ?
              'Built in Segment' : 'Custom Segment'
        }
      }),

      segmentDefinitions: data[2].map(function(segment) {
        return {
          id: segment.definition,
          text: [segment.definition, segment.name, segment.type].join(' '),
          segmentId: segment.segmentId,
          definition: segment.definition,
          name: segment.name,
          group: segment.type == 'BUILT_IN' ?
              'Built in Segment' : 'Custom Segment'
        }
      }).slice(1) // Remove the 'All Sessions' segment.
    };
  });
}
