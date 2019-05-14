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


import * as types from './types';
import segments from '../segments';
import AlertDispatcher from '../../components/alert-dispatcher';


/**
 * Removes any shown alerts and dispatches the UPDATE_PARAMS action type with
 * the passed params.
 * @param {Array} params
 * @return {Function}
 */
export function updateParams(params) {
  return (dispatch) => {
    // Hides any errors that may be showing since they may be out of date.
    // TODO(philipwalton): consider letting Redux handle the AlertDispatcher
    // component and making the errors tied to a specific param.
    AlertDispatcher.removeAll();

    dispatch({type: types.UPDATE_PARAMS, params});
  };
}


/**
 * Fetches the list of segments the authorized user can access and gets the
 * current one based on the passed `useDefinition` argument. The updateParams
 * action creator is called with the resulting segement param.
 * @param {string} segment
 * @param {boolean} useDefinition
 * @return {Function}
 */
export function swapSegmentIdAndDefinition(segment, useDefinition) {
  return async (dispatch) => {
    segment = await (useDefinition
        ? segments.getDefinitionFromId(segment)
        : segments.getIdFromDefinition(segment));

    if (typeof segment == 'string') dispatch(updateParams({segment}));
  };
}
