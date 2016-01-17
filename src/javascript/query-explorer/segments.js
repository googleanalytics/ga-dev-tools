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


/* global gapi */


/**
 * Stores the segment list to avoid multiple lookups.
 */
let cache;


// TODO(philipwalton): this module should eventually live at:
// https://github.com/googleanalytics/javascript-api-utils

let segments = {

  /**
   * Returns a promise that is resolved with an array of all segments this user
   * can access.
   * @return {goog.Promise<Array>}
   */
  get: function() {
    return cache || (cache = gapi.client.analytics.management
        .segments.list().then((response) => response.result.items));
  },


  /**
   * Returns a promise that is resolved with the segment definition
   * corresponding to the passed segment ID.
   * @param {string} segmentId The ID of the segment to get the definition for.
   * @return {goog.Promise<?string>}
   */
  getDefinitionFromId(segmentId) {
    return segments.get().then(function(segments) {
      let segment = segments.find((s) => segmentId === s.segmentId);
      return segment && segment.definition;
    });
  },


  /**
   * Returns a promise that is resolved with the segment ID corresponding
   * to the passed segment definition.
   * @param {string} definition The definition of the segment to get the ID for.
   * @return {goog.Promise<?string>}
   */
  getIdFromDefinition(definition) {
    return segments.get().then(function(segments) {
      let segment = segments.find((s) => definition === s.definition);
      return segment && segment.segmentId;
    });
  }
};


export default segments;
