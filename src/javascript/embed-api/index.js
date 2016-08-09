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


/* global $, gapi */


import debounce from 'lodash/debounce';
import site from '../site';


/**
 * IMPORTANT! The function below includes a few hacks so that the Embed API
 * demos don't interfere with the Embed API code already on the page.
 * In normal Embed API usage, these hacks aren't needed.
 */
function monkeyPatchForDemos() {

  // `authorize` has already been called at this point, so we need to
  // override the function so subsequent calls in the demo do nothing.
  gapi.analytics.auth.authorize = function() {
    // Overridden by client.
  };

  // Keep a reference to all created DataChart instances so they can be
  // redrawn on resize. Do this here instead of in the demo code to
  // avoid introducing unnecessary complexity.
  let originalDataChart = gapi.analytics.googleCharts.DataChart;
  let dataCharts = [];

  gapi.analytics.googleCharts.DataChart = function DataChart(options) {
    let dataChart = new originalDataChart(options);
    dataCharts.push(dataChart);
    return dataChart;
  };

  $(window).on('resize', debounce(function() {
    dataCharts.forEach(function(dataChart) {
      try {
        // TODO(philipwalton): update the Embed API DataChart component
        // to allow for a redraw method (or something like that). We shouldn't
        // have to do an additional query just to redraw.
        if (dataChart.get().chart.type != 'TABLE') {
          dataChart.execute();
        }
      }
      catch(e) {}
    });
  }, 200));
}


gapi.analytics.ready(function() {
  monkeyPatchForDemos();
  site.setReadyState();
});
