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


import * as types from '../constants/param-types'


export function addParam() {
  return { type: types.ADD_PARAM };
}

export function removeParam(id) {
  return { type: types.REMOVE_PARAM, id };
}

export function editParamName(id, name) {
  return { type: types.EDIT_PARAM_NAME, id, name };
}

export function editParamValue(id, value) {
  return { type: types.EDIT_PARAM_VALUE, id, value };
}
