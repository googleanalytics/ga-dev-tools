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


const PARAMS = [
  'viewId',
  'startDate',
  'endDate',
  'metrics',
  'dimensions',
  'histogramDimensions',
  'buckets',
  'sort',
  'filters',
  'segment',
  'samplingLevel',
  'includeEmptyRows',
  'start-index',
  'maxGroupCount',
  'pageSize',
  'pageToken',
  'cohortMetrics',
  'cohortSize',
  'pivotMetrics',
  'pivotDimensions',
  'startGroup',
];


/**
 * Consumes an object of query parameters and returns an object that only
 * contains whitelisted parameters with non-empty values in the correct order.
 * @param {Object} dirtyParams The params object to sanitize.
 * @return {Object} The sanitized object.
 */
export function sanitize(dirtyParams = {}) {
  let sanitizedParams = {};

  for (let param of PARAMS) {
    if (typeof dirtyParams[param] == 'string' && dirtyParams[param].length) {
      sanitizedParams[param] = dirtyParams[param];
    }
  }

  return sanitizedParams;
}
