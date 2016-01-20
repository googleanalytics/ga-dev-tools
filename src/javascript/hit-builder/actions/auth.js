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


import accountSummaries from 'javascript-api-utils/lib/account-summaries';
import * as types from './types';


function setAuthorizedState() {
  return {type: types.SET_AUTHORIZED_STATE};
}


function setUserProperties(properties) {
  return {type: types.SET_USER_PROPERTIES, properties};
}


export function handleAuthorizationSuccess() {
  return async function(dispatch) {
    dispatch(setAuthorizedState());

    let summaries = await accountSummaries.get();
    let properties = summaries.allProperties().map((property) => ({
      name: property.name,
      id: property.id,
      group: summaries.getAccountByPropertyId(property.id).name
    }));

    dispatch(setUserProperties(properties));
  };
}
