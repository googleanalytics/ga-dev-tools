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


import 'autotrack/lib/plugins/clean-url-tracker';
import 'autotrack/lib/plugins/event-tracker';
import 'autotrack/lib/plugins/impression-tracker';
import 'autotrack/lib/plugins/media-query-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';
import 'autotrack/lib/plugins/page-visibility-tracker';


/**
 * A global list of tracker object, randomized to ensure no one tracker
 * data is always sent first.
 */
const ALL_TRACKERS = shuffleArray([
  {name: 't0', trackingId: 'UA-41425441-5'},

  // NOTE(philipwalton): testing is not currently being done, so the testing
  // tracker is not used. Uncomment these lines to resume testing.
  // {name: 'testing', trackingId: 'UA-41425441-7'}
]);


const TEST_TRACKER = ALL_TRACKERS.filter(({name}) => /test/.test(name));


const metrics = {
  QUERY_SUCCESS: 'metric1',
  QUERY_ERROR: 'metric2',
  PAGE_VISIBLE: 'metric3',
  PAGE_HIDDEN: 'metric4',
};


const dimensions = {
  BREAKPOINT: 'dimension1',
  QUERY_EXPLORER_PARAMS: 'dimension2',
  QUERY_EXPLORER_SETTINGS: 'dimension3',
  RESOLUTION: 'dimension4',
  ORIENTATION: 'dimension5',
  HIT_SOURCE: 'dimension6',
  URL_QUERY_PARAMS: 'dimension7',
  METRIC_VALUE: 'dimension8',
  CLIENT_ID: 'dimension9',
};


// The command queue proxies.
const gaAll = createGaProxy(ALL_TRACKERS);
const gaTest = createGaProxy(TEST_TRACKER);


/**
 * Initializes the analytics.js trackers, adds autotrack plugins, invokes each
 * tracking customization plugin, and then sends the intial pageview after
 * the `load` event fires.
 */
function init() {
  createTrackers();
  requirePlugins();
  trackClientId();

  // Delays sending any beacons until after the load event
  // to ensure beacons don't block resources.
  window.onload = function() {
    sendInitialPageview();
  };
}


export {init, gaAll, gaTest};


/**
 * Creates a ga() proxy function that calls commands on all but the
 * excluded trackers.
 * @param {Array} trackers an array or objects containing the `name` and
 *     `trackingId` fields.
 * @return {Function} The proxied ga() function.
 */
function createGaProxy(trackers) {
  return function(command, ...args) {
    for (let {name} of trackers) {
      if (typeof command == 'function') {
        window.ga(function() {
          command(window.ga.getByName(name));
        });
      } else {
        window.ga(`${name}.${command}`, ...args);
      }
    }
  };
}


/**
 * Creates the analytics.js trackers according to the data in the
 * ALL_TRACKERS constant. In addition to this data each tracker is also
 * created with a `siteSpeedSampleRate` of 10% (up from the default 1%),
 * and in non-production environments, hits are aborted.
 */
function createTrackers() {
  for (let tracker of ALL_TRACKERS) {
    window.ga('create', tracker.trackingId, 'auto', tracker.name, {
      siteSpeedSampleRate: 10,
    });
  }
}


/**
 * Sends the initial pageview on each of the trackers. The hit source dimension
 * is set to `pageload` to distinguish it from virtual pageviews.
 */
function sendInitialPageview() {
  gaAll('send', 'pageview', {[dimensions.HIT_SOURCE]: 'pageload'});
}


/**
 * Requires various autotrack plugins on each of the trackers, passing in
 * their respective configuration options.
 */
function requirePlugins() {
  gaAll('require', 'cleanUrlTracker', {
    stripQuery: true,
    queryDimensionIndex: getDefinitionIndex(dimensions.URL_QUERY_PARAMS),
    trailingSlash: 'add',
  });
  gaAll('require', 'eventTracker');
  gaAll('require', 'impressionTracker', {
    elements: ['tech-info'],
  });
  gaAll('require', 'mediaQueryTracker', {
    definitions: [
      {
        name: 'Breakpoint',
        dimensionIndex: getDefinitionIndex(dimensions.BREAKPOINT),
        items: [
          {name: 'sm', media: 'all'},
          {name: 'md', media: '(min-width: 36em)'},
          {name: 'lg', media: '(min-width: 48em)'},
        ],
      },
      {
        name: 'Resolution',
        dimensionIndex: getDefinitionIndex(dimensions.RESOLUTION),
        items: [
          {name: '1x', media: 'all'},
          {name: '1.5x', media: '(-webkit-min-device-pixel-ratio: 1.5), ' +
                                '(min-resolution: 144dpi)'},
          {name: '2x', media: '(-webkit-min-device-pixel-ratio: 2), ' +
                                '(min-resolution: 192dpi)'},
        ],
      },
      {
        name: 'Orientation',
        dimensionIndex: getDefinitionIndex(dimensions.ORIENTATION),
        items: [
          {name: 'landscape', media: '(orientation: landscape)'},
          {name: 'portrait', media: '(orientation: portrait)'},
        ],
      },
    ],
  });
  gaAll('require', 'outboundLinkTracker');
  gaAll('require', 'pageVisibilityTracker', {
    visibleMetricIndex: getDefinitionIndex(metrics.PAGE_VISIBLE),
    hiddenMetricIndex: getDefinitionIndex(metrics.PAGE_HIDDEN),
    fieldsObj: {
      nonInteraction: null,
      [dimensions.HIT_SOURCE]: 'pageVisibilityTracker',
    },
    hitFilter: function(model) {
      model.set(dimensions.METRIC_VALUE, String(model.get('eventValue')), true);
    },
  });
}


/**
 * Sets the user's client ID as a custom dimension.
 */
function trackClientId() {
  gaAll(function(tracker) {
    let clientId = tracker.get('clientId');
    tracker.set(dimensions.CLIENT_ID, clientId);
  });
}


/**
 * Accepts a custom definition or metric and returns its numerical index.
 * @param {string} definition The definition field name.
 * @return {number} The definition index.
 */
function getDefinitionIndex(definition) {
  return +/\d+$/.exec(definition)[0];
}


/**
 * Randomizes array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * http://goo.gl/91pjZs
 * @param {Array} array The input array.
 * @return {Array} The randomized array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
