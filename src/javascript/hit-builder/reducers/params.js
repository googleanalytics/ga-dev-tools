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


export default function todos(state = [], action) {

  switch (action.type) {

    case types.ADD_PARAM:
      return [
        ...state,
        {
          id: state.reduce((max, param) => Math.max(param.id, max), -1) + 1,
          name: '',
          value: ''
        }
      ];

    case types.REMOVE_PARAM:
      return state.filter((param) => param.id !== action.id);

    case types.EDIT_PARAM_NAME:
      return state.map((param) =>
          param.id === action.id ? {...param, name: action.name} : param);

    case types.EDIT_PARAM_VALUE:
      return state.map((param) =>
          param.id === action.id ? {...param, value: action.value} : param);

    default:
      return state
  }
}
