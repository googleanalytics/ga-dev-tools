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


/* global $ */


import map from 'lodash/map';
import querystring from 'querystring';


const DEFAULT_HIT = 'v=1&t=pageview';
const REQUIRED_PARAMS = ['v', 't', 'tid', 'cid'];


let id = 1;


/**
 * Gets the initial hit from the URL if present. If a hit is found in the URL
 * it is captured and immediately stripped as to have two sources of state.
 * If no hit is found in the URL the default hit is used.
 * @return {string} The default hit.
 */
export function getInitialHitAndUpdateUrl() {
  let query = location.search.slice(1);

  if (query) {
    if (history && history.replaceState) {
      history.replaceState(history.state, document.title, location.pathname);
    }
    return query;
  } else {
    return DEFAULT_HIT;
  }
}


/**
 * Accepts a hit payload or URL and converts it into an array of param objects
 * where the required params are always first and in the correct order.
 * @param {string} hit A query string or hit payload.
 * @return {Array<Object>} The param objects.
 */
export function convertHitToParams(hit = '') {
  // If the hit contains a "?", remove it and all characters before it.
  let searchIndex = hit.indexOf('?');
  if (searchIndex > -1) hit = hit.slice(searchIndex + 1);

  let query = querystring.parse(hit);

  // Create required params first, regardless of order in the hit.
  let requiredParams = [];
  for (let name of REQUIRED_PARAMS) {
    requiredParams.push({
      id: id++,
      name: name,
      value: query[name],
      required: true,
    });
    delete query[name];
  }

  // Create optional params after required params.
  let optionalParams = map(query, (value, name) =>
      ({name, value, id: id++, isOptional: true}));

  return requiredParams.concat(optionalParams);
}


/**
 * Returns the hit model data as a query string.
 * @param {Array<Object>} params An array of param objects.
 * @return {string}
 */
export function convertParamsToHit(params) {
  let query = {};
  for (let {name, value} of params) {
    // `name` must be present, `value` can be an empty string.
    if (name && value != null) query[name] = value;
  }

  return querystring.stringify(query);
}


/**
 * Sends a validation request to the Measurement Protocol Validation Server
 * and returns a promise that will be fulfilled with the response.
 * @param {string} hit A Measurement Protocol hit payload.
 * @return {Promise}
 */
export function getHitValidationResult(hit) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: 'https://www.google-analytics.com/debug/collect',
      data: hit,
      dataType: 'json',
      success: (response) => resolve({response, hit}),
      error: reject,
    });
  });
}
