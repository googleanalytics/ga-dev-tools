// Copyright 2014 Google Inc. All rights reserved.
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


/* global explorer, google */

/**
 * namespace
 */
explorer.loader = explorer.loader || {};

/**
 * JS Library loader
 */
explorer.loader.JS_LOADER = (
    'https://www.google.com/jsapi?callback=explorer.loader.jsapiCallback');

/**
 * Asynchronously loads required libraries for the query explorer. Callback
 * is executed once all the libraries have been loaded.
 * Loads the Google API JavaScript client library.
 * Loads the Visualization API Table library.
 */
explorer.loader.loadLibs = function() {
  explorer.loader.loadJs(explorer.loader.JS_LOADER);
};


/**
 * Asynchronously loads a JavaScript library. Callback is executed once
 * complete.
 * @param {String} url The JavaScript resource to load.
 */
explorer.loader.loadJs = function(url) {
  var js = document.createElement('script');
  js.async = true;
  js.src = url;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(js, s);
};


/**
 * Loads the gviz library
 */
explorer.loader.jsapiCallback = function() {
  google.load('visualization', '1', {
    'callback': explorer.loader.handler,
    'packages': ['table']});
};


/**
 * Main callback handler for all libraries. After the google loader has loaded,
 * the loader is used to load the visualization API. Once all the libraries
 * have loaded, the LIBS_LOADED message is published.
 */
explorer.loader.handler = function() {
  // If all libraries are done loading.
  if (window.google && window.google.visualization) {
    explorer.pubsub.publish(explorer.pubsub.LIBS_LOADED);
  }
};
