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


function updateViewData(viewData) {
  return {type: types.UPDATE_VIEW_DATA, viewData};
}

export function updateView(viewSelectorData) {
  return function(dispatch, getState) {
    let {account, property, view, ids} = viewSelectorData;

    dispatch(updateParams({ids}));
    dispatch(updateViewData({account, property, view}));

    let result = await tagData.getMetricsAndDimensions(account, property, view);

    this.metrics = result.metrics;
    this.dimensions = result.dimensions;



    // TODO(philipwalton) This does need to happen after metrics and dimensions
    // potentially change, but it sould probably happen in an event handler
    // rather than here. Refactor once dimensions and metrics are moved to
    // be properties of `state`.
    // this.setSortOptions();

  }


}
