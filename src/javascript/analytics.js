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


/* global $, ga */


function setupOutBoundLinkTracking() {
  $(document).on('click', 'a', function() {

    if (location.hostname != this.hostname) {
      // Opening links in an external tabs allows the ga beacon to send.
      // When following links directly, sometimes they don't make it.
      this.target = '_blank';
      var analyticsId = $(this).attr('data-analytics-id');
      var eventAction = analyticsId ? 'click:' + analyticsId : 'click';

      ga('send', 'event', 'outbound link', eventAction, this.href);
    }
  });
}


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


module.exports = {
  track: function() {
    ga('require', 'displayfeatures');
    ga('require', 'linkid', 'linkid.js');

    setupOutBoundLinkTracking();
    setupUncaughtExceptionTracking();

    ga('send', 'pageview');
  }
};
