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
import {updateSegmentsOptions} from './select2-options';


/**
 * Returns the SET_AUTHORIZED action type.
 * @return {Object}
 */
function setAuthorizedState() {
  return {type: types.SET_AUTHORIZED_STATE};
}

/**
 * Invokes the setAuthorized action creator and the updateSegmentsOptions
 * action creator.
 * @return {Function}
 */
export function handleAuthorizationSuccess() {
  return function(dispatch, getState) {
    let {useDefinition} = getState().settings;
    dispatch(setAuthorizedState());
    dispatch(updateSegmentsOptions(useDefinition));
  };
}
