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
import 'autotrack/lib/plugins/max-scroll-tracker';
import 'autotrack/lib/plugins/media-query-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';
import 'autotrack/lib/plugins/page-visibility-tracker';
import uuid from 'uuid';


/**
 * Bump this when making backwards incompatible changes to the tracking
 * implementation. This allows you to create a segment or view filter
 * that isolates only data captured with the most recent tracking changes.
 */
const TRACKING_VERSION = '1';


/**
 * A default value for dimensions so unset values always are reported as
 * something. This is needed since Google Analytics will drop empty dimension
 * values in reports.
 */
const NULL_VALUE = '(not set)';


/**
 * A global list of tracker object, randomized to ensure no one tracker
 * data is always sent first.
 */
const ALL_TRACKERS = [
  {name: 't0', trackingId: 'UA-41425441-5'},
  {name: 'testing', trackingId: 'UA-41425441-7'},
];


const TEST_TRACKER = ALL_TRACKERS.filter(({name}) => /test/.test(name));


const metrics = {
  QUERY_SUCCESS: 'metric1',
  QUERY_ERROR: 'metric2',
  PAGE_VISIBLE: 'metric3',
  MAX_SCROLL_PERCENTAGE: 'metric4',
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
  TRACKING_VERSION: 'dimension10',
  WINDOW_ID: 'dimension11',
  HIT_ID: 'dimension12',
  HIT_TYPE: 'dimension13',
  HIT_TIME: 'dimension14',
  VISIBILITY_STATE: 'dimension15',
  PAGE_PATH: 'dimension16',
};


/**
 * Creates a ga() proxy function that calls commands on all but the
 * excluded trackers.
 * @param {Array} trackers an array or objects containing the `name` and
 *     `trackingId` fields.
 * @return {Function} The proxied ga() function.
 */
const createGaProxy = (trackers) => {
  return (command, ...args) => {
    for (let {name} of trackers) {
      if (typeof command == 'function') {
        window.ga(() => {
          command(window.ga.getByName(name));
        });
      } else {
        window.ga(`${name}.${command}`, ...args);
      }
    }
  };
};


// The command queue proxies.
const gaAll = createGaProxy(ALL_TRACKERS);
const gaTest = createGaProxy(TEST_TRACKER);


/**
 * Initializes the analytics.js trackers, adds autotrack plugins, invokes each
 * tracking customization plugin, and then sends the intial pageview after
 * the `load` event fires.
 */
const init = () => {
  // Delays sending any beacons until after the load event
  // to ensure beacons don't block resources.
  window.onload = () => {
    createTrackers();
    trackErrors();
    trackCustomDimensions();
    requirePlugins();
    sendInitialPageview();
  };
};


export {init, gaAll, gaTest};


/**
 * Creates the analytics.js trackers according to the data in the
 * ALL_TRACKERS constant. In addition to this data each tracker is also
 * created with a `siteSpeedSampleRate` of 10% (up from the default 1%),
 * and in non-production environments, hits are aborted.
 */
const createTrackers = () => {
  for (let tracker of ALL_TRACKERS) {
    window.ga('create', tracker.trackingId, 'auto', tracker.name, {
      siteSpeedSampleRate: 10,
    });
  }

  // Ensures all hits are sent via `navigator.sendBeacon()`.
  // Note: this cannot via the `create` command.
  gaAll('set', 'transport', 'beacon');

  // Log hits in non-production environments.
  if (process.env.NODE_ENV != 'production') {
    gaAll('set', 'sendHitTask', function(model) {
      let paramsToIgnore = ['v', 'did', 't', 'tid', 'ec', 'ea', 'el', 'ev',
          'a', 'z', 'ul', 'de', 'sd', 'sr', 'vp', 'je', 'fl', 'jid'];

      let hitType = model.get('&t');
      let hitPayload = model.get('hitPayload');
      let hit = hitPayload
          .split('&')
          .map(decodeURIComponent)
          .filter((item) => {
            const [param] = item.split('=');
            return !(param.charAt(0) === '_' ||
                paramsToIgnore.indexOf(param) > -1);
          });

      let parts = [model.get('&tid'), hitType];
      if (hitType == 'event') {
        parts = [
          ...parts,
          model.get('&ec'),
          model.get('&ea'),
          model.get('&el'),
        ];
        if (model.get('&ev')) parts.push(model.get('&ev'));
      }

      window['console'].log(...parts, hit);
    });
  }
};


/**
 * Tracks any errors that may have occured on the page prior to analytics being
 * initialized, then adds an event handler to track future errors.
 */
const trackErrors = () => {
  // Errors that have occurred prior to this script running are stored on
  // the `q` property of the window.onerror function.
  const errorQueue = window.onerror.q || [];

  /**
   * Overrides the temp `onerror()` handler to now send hits to GA.
   * @param {string} msg
   * @param {string} file
   * @param {number} line
   * @param {number=} col
   * @param {Error=} error
   */
  window.onerror = (msg, file, line, col, error) => {
    gaAll('send', 'event', {
      eventCategory: 'Script',
      eventAction: 'uncaught error',
      eventLabel: error ? error.stack : `${msg}\n${file}:${line}:${col}`,
      nonInteraction: true,
    });
  };

  // Replay any stored errors in the queue.
  for (let error of errorQueue) {
    window.onerror(...error);
  }
};


/**
 * Sets a default dimension value for all custom dimensions on all trackers.
 */
const trackCustomDimensions = () => {
  // Sets a default dimension value for all custom dimensions to ensure
  // that every dimension in every hit has *some* value. This is necessary
  // because Google Analytics will drop rows with empty dimension values
  // in your reports.
  Object.keys(dimensions).forEach((key) => {
    gaAll('set', dimensions[key], NULL_VALUE);
  });

  // Adds tracking of dimensions known at page load time.
  gaAll((tracker) => {
    tracker.set({
      [dimensions.TRACKING_VERSION]: TRACKING_VERSION,
      [dimensions.CLIENT_ID]: tracker.get('clientId'),
      [dimensions.WINDOW_ID]: uuid(),
    });
  });

  // Adds tracking to record each the type, time, uuid, and visibility state
  // of each hit immediately before it's sent.
  gaAll((tracker) => {
    const originalBuildHitTask = tracker.get('buildHitTask');
    tracker.set('buildHitTask', (model) => {
      model.set(dimensions.HIT_ID, uuid(), true);
      model.set(dimensions.HIT_TIME, String(+new Date), true);
      model.set(dimensions.HIT_TYPE, model.get('hitType'), true);
      model.set(dimensions.VISIBILITY_STATE, document.visibilityState, true);

      const page = model.get('page') || (location.pathname + location.search);
      model.set(dimensions.PAGE_PATH, page, true),

      originalBuildHitTask(model);
    });
  });
};


/**
 * Sends the initial pageview on each of the trackers. The hit source dimension
 * is set to `pageload` to distinguish it from virtual pageviews.
 */
const sendInitialPageview = () => {
  gaAll('send', 'pageview', {[dimensions.HIT_SOURCE]: 'pageload'});
};


/**
 * Requires various autotrack plugins on each of the trackers, passing in
 * their respective configuration options.
 */
const requirePlugins = () => {
  gaAll('require', 'cleanUrlTracker', {
    stripQuery: true,
    queryDimensionIndex: getDefinitionIndex(dimensions.URL_QUERY_PARAMS),
    trailingSlash: 'add',
  });
  gaAll('require', 'eventTracker');
  gaTest('require', 'maxScrollTracker', {
    sessionTimeout: 30,
    timeZone: 'America/Los_Angeles',
    maxScrollMetricIndex: getDefinitionIndex(metrics.MAX_SCROLL_PERCENTAGE),
  });
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
  gaTest('require', 'pageVisibilityTracker', {
    visibleMetricIndex: getDefinitionIndex(metrics.PAGE_VISIBLE),
    sessionTimeout: 30,
    timeZone: 'America/Los_Angeles',
    fieldsObj: {[dimensions.HIT_SOURCE]: 'pageVisibilityTracker'},
  });
};


/**
 * Accepts a custom definition or metric and returns its numerical index.
 * @param {string} definition The definition field name.
 * @return {number} The definition index.
 */
const getDefinitionIndex = (definition) => {
  return +/\d+$/.exec(definition)[0];
};
