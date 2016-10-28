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


/* global gapi */


import {loadScript} from './utils';


const API_KEY = 'AIzaSyAuFQbCnospjGuTyjGTIgW_RoocFZ9KGus';


const urlMapCache = {};


let urlShortenerLoadPromise;


/**
 * Loads the Google APIs client and the urlshortener v1 library.
 * @return {Promise} A promise resolved once the library is loaded.
 */
function loadUrlShortenerApi() {
  return new Promise((resolve, reject) => {
    loadScript('https://apis.google.com/js/api.js').then(() => {
      gapi.load('client', () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('urlshortener', 'v1')
            .then(() => resolve(gapi.client.urlshortener.url),
                  (err) => reject(err));
      });
    }, reject);
  });
}


/**
 * Returns the cached API load promise or calls `loadUrlShortenerApi` and
 * caches the result.
 * @return {Promise} A promise resolved once the library is loaded.
 */
function urlShortenerApiReady() {
  return urlShortenerLoadPromise ||
      (urlShortenerLoadPromise = loadUrlShortenerApi());
}


/**
 * Accepts a long URL and returns a promise that is resolved with its shortened
 * version. This function loads the urlshortener API if it's not loaded, but
 * the library is only ever loaded once. Long URLs are also cached, so multiple
 * requests for the same URL are never made.
 * @param {string} longUrl
 * @return {Promise} A promise resolved with the shortend URL.
 */
export function shortenUrl(longUrl) {
  return new Promise((resolve, reject) => {
    if (urlMapCache[longUrl]) {
      resolve(urlMapCache[longUrl]);
    } else {
      urlShortenerApiReady().then((urlshortener) => {
        urlshortener.insert({longUrl}).then(({result}) => {
          resolve(result.id);
        }, ({result}) => {
          reject(new Error(result.error.message));
        });
      });
    }
  });
}
