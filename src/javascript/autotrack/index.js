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
import AlertDispatcher from '../components/alert-dispatcher';


let baseOptions = {
  query: {
    ids: 'ga:100367422', // The Demos & Tools website view.
    'start-date': '7daysAgo',
    'end-date': 'today'
  },
  chart: {
    options: {
      width: '100%',
      vAxis: {
        'gridlines': {
          'color': '#e8e8e8'
        }
      }
    }
  }
};


let pieChartOptions = {
  chart: {
    options: {
      pieHole: 4/9,
      height: 280,
      chartArea: {
        top: 16,
        height: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }
};


/**
 * Renders a new DataChart component and returns a completion promise.
 * @param {string} container The element ID to render the chart inside.
 * @param {Array} options An array of DataChart options to set on the instance.
 * @return {Promise} A promise resolved when the chart is rendered.
 */
function renderDataChart(container, options) {
  return new Promise(function(resolve, reject) {
    let chart = new gapi.analytics.googleCharts.DataChart({chart: {container}});
    for (let option of options) {
      chart.set(option);
    }
    let chartOptions = chart.get().chart;
    if (chartOptions.type != 'TABLE') {
      $(window).on('resize', debounce(() => chart.execute(), 200));
    }
    chart.once('success', resolve);
    chart.once('error', reject);
    chart.execute();
  });
}


gapi.analytics.ready(function() {

  /**
   * Creates a new DataChart instance showing top outbound link clicks.
   */
  let outboundLink = renderDataChart('outbound-links-chart-container', [
    baseOptions,
    {
      query: {
        metrics: 'ga:totalEvents',
        dimensions: 'ga:eventLabel',
        sort: '-ga:totalEvents',
        filters: 'ga:eventCategory==Outbound Link;ga:eventAction==click',
        'max-results': 10
      },
      chart: {'type': 'TABLE'}
    }
  ]);


  /**
   * Creates a new DataChart instance showing sign-in/out events.
   */
  let authEvents = renderDataChart('auth-events-chart-container', [
    baseOptions,
    {
      query: {
        'metrics': 'ga:totalEvents',
        'dimensions': 'ga:eventCategory,ga:eventAction',
        'sort': '-ga:totalEvents',
        'filters': 'ga:eventCategory==User;ga:eventAction=~sign(in|out)',
        'max-results': 2
      },
      chart: {'type': 'TABLE'}
    }
  ]);


  /**
   * Creates a new DataChart instance showing breakpoint usage.
   */
  let breakpoint = renderDataChart('breakpoint-chart-container', [
    baseOptions,
    pieChartOptions,
    {
      query: {
        'metrics': 'ga:sessions',
        'dimensions': 'ga:dimension1',
        'sort': '-ga:sessions',
        'max-results': 4
      },
      chart: {'type': 'PIE'}
    }
  ]);


  /**
   * Creates a new DataChart instance showing device resolution.
   */
  let resolution = renderDataChart('resolution-chart-container', [
    baseOptions,
    pieChartOptions,
    {
      query: {
        'metrics': 'ga:sessions',
        'dimensions': 'ga:dimension4',
        'sort': '-ga:sessions',
        'max-results': 3
      },
      chart: {'type': 'PIE'}
    }
  ]);


  /**
   * Creates a new DataChart instance showing device orientation.
   */
  let orientation = renderDataChart('orientation-chart-container', [
    baseOptions,
    pieChartOptions,
    {
      query: {
        'metrics': 'ga:sessions',
        'dimensions': 'ga:dimension5',
        'sort': '-ga:sessions',
        'max-results': 2
      },
      chart: {'type': 'PIE'}
    }
  ]);


  /**
   * Creates a new DataChart instance showing breakpoint change events.
   */
  let breakpointChange = renderDataChart('breakpoint-change-chart-container', [
    baseOptions,
    {
      query: {
        metrics: 'ga:totalEvents',
        dimensions: 'ga:eventLabel',
        sort: '-ga:totalEvents',
        filters: 'ga:eventCategory==Breakpoint;ga:eventAction==change',
        'max-results': 8
      },
      chart: {type: 'COLUMN'}
    }
  ]);


  // Adds error handling.
  Promise.all([
    outboundLink,
    authEvents,
    breakpoint,
    resolution,
    orientation,
    breakpointChange
  ])
  .catch(function() {
    AlertDispatcher.addOnce({
      title: 'Oops! Something went wrong.',
      message: 'There was an error executing some of the queries. ' +
          'Try refreshing the page to run them again.'
    });
  });

});
