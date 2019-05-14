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


import qs from 'querystring';

// TODO(Lucretiel): url isn't actually a dependency of this project.
// it seems like url-parse is the better library, anyway, so switch
// to that at some point.
import url from 'url';


export const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];


export const REQUIRED_PARAMS = PARAMS.slice(0, 1);


/**
 * Accepts the fragment portion of a URL and returns an object containing any
 * extracted campaign params as well as the new fragment string with the params
 * removed.
 * @param {string} fragment
 * @return {Object} The extracted params and the bare, resulting string.
 */
function extractParamsFromFragment(fragment) {
  const extractedFragmentParams = {};
  const bareFragment = fragment.replace(
      /&?(utm_(?:campaign|source|medium|term|content))(?:=([^&]+))?/g,
      (match, name, value) => {
        extractedFragmentParams[name] = value;
        return '';
      });

  return {bareFragment, extractedFragmentParams};
}


/**
 * Accepts the query portion of a URL and returns an object containing any
 * extracted campaign params as well as the new query string with the params
 * removed.
 * @param {string} query
 * @return {Object} The extracted params and the bare, resulting string.
 */
function extractParamsFromQuery(query) {
  const queryParams = qs.parse(query);
  const extractedQueryParams = {};
  const nonQueryParams = {};

  for (const param of Object.keys(queryParams)) {
    if (PARAMS.includes(param)) {
      extractedQueryParams[param] = queryParams[param];
    } else {
      nonQueryParams[param] = queryParams[param];
    }
  }

  const bareQuery = qs.stringify(nonQueryParams);

  return {bareQuery, extractedQueryParams};
}


/**
 * Accepts a URL and returns an object containing any extracted campaign params
 * (from either the query or fragment parts) as well as a new URL with the
 * params removed.
 * @param {string} websiteUrl
 * @return {Object} The extracted params and the new URL.
 */
export function extractParamsFromWebsiteUrl(websiteUrl) {
  const websiteUrlObj = url.parse(websiteUrl);
  const query = (websiteUrlObj.search && websiteUrlObj.search.slice(1)) || '';
  const fragment = (websiteUrlObj.hash && websiteUrlObj.hash.slice(1)) || '';

  const {bareFragment, extractedFragmentParams} =
      extractParamsFromFragment(fragment);

  websiteUrlObj.hash = bareFragment ? `#${bareFragment}` : null;

  const {bareQuery, extractedQueryParams} =
      extractParamsFromQuery(query);

  websiteUrlObj.search = bareQuery ? `?${bareQuery}` : null;

  const params = {
    ...extractedQueryParams,
    ...extractedFragmentParams,
  };

  const bareUrl = url.format(websiteUrlObj);

  return {params, bareUrl};
}


/**
 * Accepts a URL without campaign params and adds the passed params to either
 * the query or fragment portion of the URL.
 * @param {string} bareUrl The URL with the query params.
 * @param {Object} params The params to add to the URL.
 * @param {boolean} useFragment
 * @return {string} The URL with the params added.
 */
export function addParamsToUrl(bareUrl, params, useFragment) {
  const bareUrlObj = url.parse(bareUrl);

  if (useFragment) {
    if (!bareUrlObj.hash) {
      bareUrlObj.hash = `#${qs.stringify(params)}`;
    } else if (/[?&#]$/.test(bareUrlObj.hash)) {
      bareUrlObj.hash += `${qs.stringify(params)}`;
    } else {
      bareUrlObj.hash += `&${qs.stringify(params)}`;
    }
  } else {
    const queryParams = qs.parse(bareUrlObj.query);
    Object.assign(queryParams, params);
    bareUrlObj.search = `?${qs.stringify(queryParams)}`;
  }

  return url.format(bareUrlObj);
}


/**
 * Accepts an object of params and returns a new object only containing keys
 * of known campaign params.
 * @param {Object} params The params to be sanitized.
 * @param {{trim: (boolean), removeBlanks: (boolean)}} opts
 *     trim: If true param values are stripped of leading/trailing whitespace.
 *     removeBlanks: If try empty string values ignored.
 * @return {Object} The sanitized params
 */
export function sanitizeParams(params, opts = {}) {
  const sanitizedParams = {};

  if (params && typeof params == 'object') {
    for (const param of PARAMS) {
      const value = params[param];

      // The param value can only be a string.
      if (typeof value != 'string') continue;

      if (value || !opts.removeBlanks) {
        sanitizedParams[param] = opts.trim ? value.trim() : value;
      }
    }
  }
  return sanitizedParams;
}
