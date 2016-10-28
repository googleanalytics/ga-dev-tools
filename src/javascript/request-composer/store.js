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


import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {sanitize} from './query-params';
import reducer from './reducers';
import db from '../data-store';


let middlewear = [thunkMiddleware];


// Adds a logger in non-production mode.
if (process.env.NODE_ENV != 'production') {
  // Uses `require` here instead of `import` so the module isn't included
  // in the production build.
  middlewear.push(require('redux-logger')());
}


let createStoreWithMiddleware = applyMiddleware(...middlewear)(createStore);


/**
 * Gets the query params used to populate the params model.
 * If params are found in the URL, they are used and merged with the defaults.
 * Otherwise the datastore is checked for params from a previous session, and
 * those are merged with the defaults.
 * If no params exist in the URL or the datastore, the defaults are returned.
 * @return {Object} The initial params.
 */
function getInitalQueryParams() {
  let defaultParams = {
    'startDate': '30daysAgo',
    'endDate': 'yesterday',
    'cohortSize': 'Day',
    'cohortMetrics': 'ga:cohortActiveUsers',
  };
  let storedParams = db.get('request-composer:params');
  if (storedParams) {
    return sanitize({...defaultParams, ...storedParams});
  } else {
    return defaultParams;
  }
}


/**
 * Gets the Requet Composer settings stored in local storage. If no settings
 * exist, an empty object is returned.
 * @return {Object} The settings object.
 */
function getDefaultSettingsAndUpdateTracker() {
  let settings = db.get('request-composer:settings') || {
    'requestType': 'HISTOGRAM',
  };
  return settings;
}

/**
 * Gets the Requet Composer default select2 options.
 * @return {Object} The default select2 options
 */
function getDefaultSelect2Options() {
  return {
    metrics: [],
    dimensions: [],
    pivotMetrics: [],
    pivotDimensions: [],
    cohortMetrics: [],
    histogramDimensions: [],
    sort: [],
    segments: [],
  };
}


let store = createStoreWithMiddleware(reducer, {
  isAuthorized: false,
  isQuerying: false,
  params: getInitalQueryParams(),
  select2Options: getDefaultSelect2Options(),
  settings: getDefaultSettingsAndUpdateTracker(),
});


// TODO(philipwalton): create middleware to save the params and settings
// to localStorage.
store.subscribe(function() {
  let {params, settings} = store.getState();

  db.set('request-composer:settings', settings);
  db.set('request-composer:params', params);
});


export default store;
