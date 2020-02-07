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

import accountSummaries from "javascript-api-utils/lib/account-summaries";
import * as types from "./types";

interface SetAuthorized {
  type: typeof types.SET_AUTHORIZED;
}

interface SetUserProperties {
  type: typeof types.SET_USER_PROPERTIES;
  properties: Property[];
}

interface Property {
  name: any;
  id: any;
  group: any;
}

type Action = SetAuthorized | SetUserProperties;

type Dispatch = (action: Action) => void;

/**
 * Returns the SET_AUTHORIZED action type.
 */
function setAuthorized(): SetAuthorized {
  return { type: types.SET_AUTHORIZED };
}

/**
 * Returns the SET_USER_PROPERTIES action type and the new properties.
 */
function setUserProperties(properties: Property[]): SetUserProperties {
  return { type: types.SET_USER_PROPERTIES, properties };
}

/**
 * Invokes the setAuthorized action creator and the setUserProperties
 * action creator after retrieving the list of properties for the authorized
 * user.
 */
export function handleAuthorizationSuccess(): (
  dispatch: Dispatch
) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(setAuthorized());

    const summaries = await accountSummaries.get();
    const properties = summaries.allProperties().map(property => ({
      name: property.name,
      id: property.id,
      group: summaries.getAccountByPropertyId(property.id).name
    }));

    dispatch(setUserProperties(properties));
  };
}
