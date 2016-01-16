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
import {updateParams} from './params';
import {updateSelect2Options} from './select2-options';
import tagData from '../tag-data';


async function handleUseDefinitionChange(dispatch, useDefinition, params) {

  let segments = await tagData.getSegments(useDefinition);

  dispatch(updateSelect2Options({segments}));

  if (params.segment) {
    let value = params.segment;
    let segment = segments.find((s) => value == s.sId || value == s.definition);

    if (segment) {
      segment = useDefinition ? segment.definition : segment.segmentId
      dispatch(updateParams({segment}));
    }
    else {
      // TODO(philipwalton): investigate why this can't be null and needs
      // to be an empty string (fails when calling toLowerCase()).
      dispatch(updateParams({segment: ''}));
    }
  }
}


export function updateSettings(settings) {
  return function(dispatch, getState) {
    let {params, settings: prevSettings} = getState();
    let {useDefinition} = settings;

    if (useDefinition != prevSettings.useDefinition) {
      handleUseDefinitionChange(dispatch, useDefinition, params);
    }

    dispatch({type: types.UPDATE_SETTINGS, settings});
  };
}
