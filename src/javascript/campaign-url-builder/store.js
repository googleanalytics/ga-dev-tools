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
import {removeEmptyParams, sanitizeParams} from './params';
import reducer from './reducers';
import db from '../data-store';


let middlewear = [thunkMiddleware];


// Adds a logger in non-production mode.
if (process.env.NODE_ENV != 'production') {
  // Uses `require` here instead of `import` so the module isn't included
  // in the production build.
  middlewear.push(require('redux-logger')());
}


/**
 * Gets the initial redux state tree from local storage.
 * @return {Object} The state object.
 */
function getStoredInitialState() {
  let websiteUrl = db.get('campaign-url-builder:websiteUrl');
  let params = db.get('campaign-url-builder:params');
  let settings = db.get('campaign-url-builder:settings');

  return {
    websiteUrl: typeof websiteUrl == 'string' ? websiteUrl : '',
    params: removeEmptyParams(sanitizeParams(params)),
    settings: (settings && typeof settings == 'object') ? settings : {},
  };
}


let createStoreWithMiddleware = applyMiddleware(...middlewear)(createStore);


let store = createStoreWithMiddleware(reducer, getStoredInitialState());


// TODO(philipwalton): create middleware to save the params and settings
// to localStorage.
store.subscribe(function() {
  let {websiteUrl, params, settings} = store.getState();
  db.set('campaign-url-builder:websiteUrl', websiteUrl);
  db.set('campaign-url-builder:params', params);
  db.set('campaign-url-builder:settings', settings);
});


export default store;
