// Copyright 2017 Google Inc. All rights reserved.
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


import idb from 'idb-keyval';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';


const IDB_KEY = 'usage-trends';


const getDefaults = (params) => {
  return {
    auth: {isSignedIn: false},
    options: {},
    params: params ? params : {
      dateRange: 365,
      dimension: 'ga:sourceMedium',
      maxResults: 5,
      metric: 'ga:sessions',
    },
    report: {},
  };
};


/**
 * Gets the initial redux state tree from local storage.
 * @return {Object} The state object.
 */
const getInitialState = () => {
  return idb.get(IDB_KEY)
      .then((params) => getDefaults(params))
      .catch(() => getDefaults());
};


/**
 * Asychronously loads an middleware and resolves with a
 * `createStoreWithMiddleware()` function that can be passed a redux reducer
 * and state object.
 * @return {!Promise<Function>}
 */
const createStoreWithMiddlewarePromise = () => {
  const middlewearPromises = [];

  if (process.env.NODE_ENV != 'production') {
    middlewearPromises.push(
        import('redux-logger').then((logger) => logger()));
  }

  return Promise.all(middlewearPromises)
      .then((middlewear) => applyMiddleware(...middlewear)(createStore));
};


/**
 * Asynchronously creates the redux store by reading the data form IDB
 * and conditionally loading middleware based on the environment.
 * @return {Promise}
 */
export const getStore = () => {
  return Promise.all([
    getInitialState(),
    createStoreWithMiddlewarePromise(),
  ]).then(([state, createStoreWithMiddleware]) => {
    const store = createStoreWithMiddleware(reducer, state);
    store.subscribe(() => idb.set(IDB_KEY, store.getState().params));

    return store;
  });
};
