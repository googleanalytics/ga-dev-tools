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


var dataStore = require('../data-store');
var isQuerying = false;
var serialize = require('../serialize');
var template = require('lodash').template;


var CSV_PATH = '/explorer/csvhandler.csv';
var BUTTON_TEXT = 'Get Data';
var BUTTON_LOADING_TEXT = 'Loading...';


var queryErrorTemplate = template(
    '<aside class="Error">' +
    '  <h3 class="Error-title">Ack! There was an error (<%- code %>).</h3>' +
    '  <p class="Error-message"><%- message %></p>' +
    '</aside>');


/**
 * The chart options.
 * TODO(philipwalton): remove the cssClassNames once the Embed API is updated.
 */
var chartOptions = {
  sort: 'enable',
  width: 'auto',
  cssClassNames: {
    headerRow: 'gapi2-analytics-data-chart-thr',
    tableRow: 'gapi2-analytics-data-chart-tr',
    oddTableRow: 'gapi2-analytics-data-chart-tr-odd',
    selectedTableRow: 'gapi2-analytics-data-chart-tr-selected',
    hoverTableRow: 'gapi2-analytics-data-chart-tr-hover',
    headerCell: 'gapi2-analytics-data-chart-th',
    tableCell: 'gapi2-analytics-data-chart-td'
  }
};


/**
 * Fetches any saved form data from local storage and updates the fields on the
 * page. For each key in the returned data, if a field on the page exists with
 * the corresponding ID, that field is set to the saved value.
 */
function setStateFromDataStore() {
  var data = dataStore.get('query-explorer');
  if (data) {
    Object.keys(data).forEach(function(key) {
      var $field = $('#' + key);
      var value = data[key];
      if ($field.is('input[type="checkbox"]')) {
        $field.prop('checked', value)
      }
      else {
        $field.val(value);
      }
    });
  }
}


/**
 * Handler for once the query succeed and the chart is fully rendered.
 * @param {Object} reponse The API response.
 */
function onDataChartSuccess(response) {
  $('#save-tsv').removeAttr('hidden');
  $('#query-error-container').empty();

  toggleButtonLoadingState();
}


/**
 * Handler for any errors occuring while making the request or rendering the
 * chart.
 * @param {Error} err The error object itself.
 */
function onDataChartError(err) {
  $('#save-tsv').attr('hidden', true);
  $('#query-error-container').html(queryErrorTemplate(err.error));

  toggleButtonLoadingState();
}


/**
 * Handler for when the user submits the form. This creates a new DataChart
 * components, executes the query, and adds event handlers for error and
 * success.
 * @param {Event} e The DOM event.
 */
function onFormSubmit(e) {
  e.preventDefault();
  toggleButtonLoadingState();

  var query = serialize.asObject($(this));
  var dataChart = new gapi.analytics.googleCharts.DataChart({
    query: query,
    chart: {
      type: 'TABLE',
      container: 'chart-container',
      options: chartOptions
    }
  });

  dataChart.once('error', onDataChartError);
  dataChart.once('success', onDataChartSuccess);
  dataChart.execute();
}


/**
 * Handler for when the user clicks to save the report as TSV
 * @param {Event} e The DOM event.
 */
function onTSVLinkClick(e) {
  var access_token = gapi.auth.getToken().access_token;
  this.href = CSV_PATH + serialize.asQueryString($('#query-explorer')) +
      '&access_token=' + access_token;
}


/**
 * A handler that runs any time the change event occurs on the page.
 * This handler saves the changed data to the data store.
 * @param {Event} e The DOM event.
 */
function onFieldChange(e) {
  var $field = $(e.target);
  var obj = {};
  var id = $field.attr('id');
  var value = $field.is('input[type="checkbox"]') ?
      $field.prop('checked') : $field.val();

  if (id) {
    obj[id] = value;
    dataStore.set('query-explorer', obj);
  }
}


/**
 * Handles disabling the submit button while the query is in progress.
 */
function toggleButtonLoadingState() {
  isQuerying = !isQuerying;
  $('#get-data').text(isQuerying ? BUTTON_LOADING_TEXT : BUTTON_TEXT)
                .prop('disabled', isQuerying);
}


module.exports = {

  /**
   * Initialize the form by adding submit events and listening for clicks on
   * the TSV download button.
   */
  init: function() {
    setStateFromDataStore();

    $('#save-tsv').on('click', onTSVLinkClick);
    $('#query-explorer').on('change', onFieldChange)
                        .on('submit', onFormSubmit);
  }
};
