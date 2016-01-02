// Copyright 2015 Google Inc. All rights reserved.
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


/* global $, ga */


import 'autotrack/lib/plugins/media-query-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';
import 'autotrack/lib/plugins/session-duration-tracker';


let mediaQueryDefinitions = [
  {
    name: 'Breakpoint',
    dimensionIndex: 1,
    items: [
      {name: 'xs', media: 'all'},
      {name: 'sm', media: '(min-width: 420px)'},
      {name: 'md', media: '(min-width: 570px)'},
      {name: 'lg', media: '(min-width: 1024px)'}
    ]
  }
];


function setupUncaughtExceptionTracking() {
  window.onerror = function(message, url, line, col) {
    var desc = 'Uncaught error: ' +
        message + ' (line: ' + line + ', url: ' + url + ', col: ' + col + ')';

    ga('send', 'exception', {
      exDescription: desc,
      exFatal: false
    });
  };
}


export default {
  track: function() {
    ga('require', 'displayfeatures');
    ga('require', 'linkid');
    ga('require', 'mediaQueryTracker', {mediaQueryDefinitions});
    ga('require', 'outboundLinkTracker');
    ga('require', 'sessionDurationTracker');
    ga('send', 'pageview');

    setupUncaughtExceptionTracking();
  }
};
