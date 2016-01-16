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
function getMetricTags(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then(
         (columns) => columns.allMetrics('public'));
}


/**
 * Returns a promise that is resolved with an array of all public dimensions.
 * @return {goog.Promise}
 */
function getDimensionTags(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then(
         (columns) => columns.allDimensions('public'));
}


/**
 * Returns a promise that is resolved with an array of all segments this user
 * can access.
 * @return {goog.Promise}
 */
let segmentCache;
function getSegmentTags() {
  return segmentCache || (segmentCache = gapi.client.analytics.management
      .segments.list().then((response) => response.result.items));
}


export default {

  getMetricsAndDimensions(account, property, view) {
    return Promise.all([
      getMetricTags(account, property, view),
      getDimensionTags(account, property, view)
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

      return {metrics, dimensions};
    });
  },

  getSegments(useDefinition) {
    return getSegmentTags().then(function(results) {
      let segments = results.map(function(segment) {
        return {
          id: useDefinition ? segment.definition : segment.segmentId,
          definition: segment.definition,
          segmentId: segment.segmentId,
          name: segment.name,
          group: segment.type == 'BUILT_IN' ?
              'Built in Segment' : 'Custom Segment'
        }
      });

      // Remove the 'All Sessions' segment when using definitions.
      if (useDefinition) segments = segments.slice(1);

      return segments;
    });
  },
}
