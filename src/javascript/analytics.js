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


import 'autotrack/lib/plugins/event-tracker';
import 'autotrack/lib/plugins/media-query-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';
import 'autotrack/lib/plugins/page-visibility-tracker';


let autotrackOpts = {
  mediaQueryDefinitions: [
    {
      name: 'Breakpoint',
      dimensionIndex: 1,
      items: [
        {name: 'xs', media: 'all'},
        {name: 'sm', media: '(min-width: 420px)'},
        {name: 'md', media: '(min-width: 570px)'},
        {name: 'lg', media: '(min-width: 1024px)'}
      ]
    },
    {
      name: 'Resolution',
      dimensionIndex: 4,
      items: [
        {name: '1x',   media: 'all'},
        {name: '1.5x', media: '(-webkit-min-device-pixel-ratio: 1.5), ' +
                              '(min-resolution: 144dpi)'},
        {name: '2x',   media: '(-webkit-min-device-pixel-ratio: 2), ' +
                              '(min-resolution: 192dpi)'}
      ]
    },
    {
      name: 'Orientation',
      dimensionIndex: 5,
      items: [
        {name: 'landscape', media: '(orientation: landscape)'},
        {name: 'portrait',  media: '(orientation: portrait)'}
      ]
    }
  ],
  virtualPageviewFields: {
    dimension6: 'pageVisibilityTracker'
  },
  searchDimensionIndex: 7,
  urlHasTrailingSlash: 'always' // 'always' | 'never' | function
};


// Randomizes the order in which tracker methods are called.
// This is necessary because latter trackers will lose more hits (for various
// reasons) and the results will be skewed.
let trackerNames = ['t0', 'testing'];
let randomizedTrackerNames = [];
while (trackerNames.length) {
  let index = Math.floor(Math.random() * trackerNames.length);
  let name = trackerNames.splice(index, 1)[0];
  randomizedTrackerNames.push(name);
}


/**
 * Experimental possible future plugin logic.
 */
function cleanUrlTracker(opts) {

  // Removes the
  return function() {
    let tracker = window.ga.getByName('testing');
    let path = location.pathname;
    let search = location.search.slice(1);

    if (opts.urlHasTrailingSlash  == 'always') {
      path = path.replace(/\/+$/, '') + '/';
    }
    // else if (opts.urlHasTrailingSlash == 'never') {
    //   path = path.replace(/\/+$/, '')
    // }
    // else if (typeof opts.urlHasTrailingSlash == 'function') {
    //   path = opts.urlHasTrailingSlash(path);
    // }

    tracker.set('page', path);

    if (opts.searchDimensionIndex) {
      tracker.set('dimension' + opts.searchDimensionIndex,
          search || '(not set)');
    }
  };
}


/**
 * Initializes all analytics.js tracking.
 */
export function init() {

  // Requires official plugins
  ga('require', 'displayfeatures');
  ga('require', 'linkid');

  // Requires autotrack plugins
  ga('require', 'eventTracker', autotrackOpts);
  ga('require', 'mediaQueryTracker', autotrackOpts);
  ga('require', 'outboundLinkTracker', autotrackOpts);

  // Adds experimental clearnUrlTracker plugin.
  window.ga(cleanUrlTracker(autotrackOpts));

  // Only requires pageVisibilityTracker on the testing tracker.
  window.ga('testing.require', 'pageVisibilityTracker', autotrackOpts);

  ga('send', 'pageview', {dimension6: 'pageload'});
}


/**
 * Shadows the global `ga` command queue to allow for running commands on
 * multiple test trackers.
 * @param {string} command The command to run.
 * @param {*} ...args A list of arguments to pass to the command queue.
 */
export function ga(command, ...args) {
  for (let name of randomizedTrackerNames) {
    window.ga(name + '.' + command, ...args);
  }
}
