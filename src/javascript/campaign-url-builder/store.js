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


import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {sanitizeParams} from './params';
import reducer from './reducers';
import db from '../data-store';

/**
 * Generate the list of middlewares. Contains logic for conditional and
 * development-only middleware, as well as conditional requires.
 * @yield {Middleware} each middleware to apply to the store
 */
function* getMiddlewares() {
  yield thunkMiddleware;

  // Adds a logger in non-production mode.
  if (process.env.NODE_ENV !== 'production') {
    // Uses `require` here instead of `import` so the module isn't included
    // in the production build.
    const {createLogger} = require('redux-logger');
    yield createLogger();
  }
}

/**
 * Gets the initial redux state tree from local storage.
 * @return {Object} The state object.
 */
function getStoredInitialState() {
  const websiteUrl = db.get('campaign-url-builder:websiteUrl');
  const params = db.get('campaign-url-builder:params');
  const settings = db.get('campaign-url-builder:settings');

  return {
    websiteUrl: typeof websiteUrl === 'string' ? websiteUrl : '',
    params: sanitizeParams(params, {removeBlanks: true}),
    settings: (settings && typeof settings === 'object') ? settings : {},
  };
}

const composeEnhancers = process.env.NODE_ENV !== 'production' ?
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) :
  compose;


const store = createStore(
    reducer,
    getStoredInitialState(),
    composeEnhancers(
        applyMiddleware(...getMiddlewares())
    )
);

// TODO(philipwalton): create middleware to save the params and settings
// to localStorage.
store.subscribe(function() {
  const {websiteUrl, params, settings} = store.getState();
  db.set('campaign-url-builder:websiteUrl', websiteUrl);
  db.set('campaign-url-builder:params', params);
  db.set('campaign-url-builder:settings', settings);
});


export default store;
