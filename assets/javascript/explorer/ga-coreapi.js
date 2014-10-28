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


/* global $, gapi, google */

/**
 * @fileoverview This is the main file of the query explorer. It contains
 * the login to have this tool live within an iFrame for security purposes.
 * It also handles AuthSub token rediction. This file also provides a class
 * to simplify constructing Google Analytics Data Export API Queries. JQuery
 * must be referenced in order for the Explorer class to work.
 * @author api.nickm@gmail.com (Nick Mihailovski)
 */

// Create a namespace if not done already.
var explorer = explorer || {};

/**
 * Core Reporting API query configuration
 * @type {Object}
 */
explorer.coreapi = {};


/**
 * Dimension list dropdown.
 * @type {explorer.CheckDropdown}
 */
explorer.coreapi.dimensionsDropdown = new explorer.CheckDropdown();


/**
 * Metric list dropdown.
 * @type {explorer.CheckDropdown}
 */
explorer.coreapi.metricsDropdown = new explorer.CheckDropdown();


/**
 * Segment list dropdown.
 * @type {explorer.SegmentsDropdown}
 */
explorer.coreapi.segmentDropdown = new explorer.SegmentsDropdown();


/**
 * Stores GA API query parameters.
 * @type {explorer.DataQuery}
 */
explorer.coreapi.dataQuery = new explorer.DataQuery();


/**
 * Stores a blob of CSV data. Used for csv export.
 * @type {Object}
 */
explorer.coreapi.csvBlob = {};


/**
 * Whether the download attribute of an anchor link is supported.
 * This is calculated once and stored in this variable.
 * @type {Boolean}
 */
explorer.coreapi.downloadSupported = false;


/**
 * Default for the maximum number of query results.
 * @type {number}
 */
explorer.coreapi.MAX_QUERY_RESULTS = '50';


/**
 * Initialize the Explorer
 */
explorer.coreapi.init = function() {
  explorer.pubsub.subscribe(explorer.pubsub.HAS_AUTH,
                            explorer.coreapi.displayHasAuth);
  explorer.pubsub.subscribe(explorer.pubsub.HAS_AUTH,
                            explorer.coreapi.queryForSegmentDropdown);
  explorer.pubsub.subscribe(explorer.pubsub.DATA_QUERY_UPDATE,
                            explorer.coreapi.updateUiFromDataQuery);

  explorer.coreapi.displayUi();
  explorer.coreapi.createHelpText();
  explorer.coreapi.addFancyRollOvers();

  explorer.coreapi.initDataQuery();

  explorer.coreapi.dimensionsDropdown.init('dimensions', explorer.dimensionsHelp, 'gaHelp');
  explorer.coreapi.metricsDropdown.init('metrics', explorer.metricsHelp, 'gaHelp');
  explorer.coreapi.segmentDropdown.init('segment', explorer.segmentsHelp, 'gaHelp');

  explorer.coreapi.setupUiLinkHandlers();
  explorer.coreapi.setupBubbleHandlers();
  $('#explorer').removeClass('hidden');

  explorer.coreapi.displayDatePicker('start-date');
  explorer.coreapi.displayDatePicker('end-date');

  explorer.coreapi.initCsvDownloadLink();

};


/**
 * Updates the display once a user has authenticated with the
 * Google Analytics Authentication service.
 */
explorer.coreapi.displayHasAuth = function() {
  $('#getData').show();
};


/**
 * Handles all the work of adding the labels and query parameter
 * input boxes for each parameter that exists in this class' dataQuery.query
 * object. It uses the explorer.queryConfig[param].size value to set the width of
 * each input box. This also adds a keyup handler to all the input boxes to
 * update the value in the corresponding data query object's parameter.
 */
explorer.coreapi.displayUi = function() {
  var html = ['<ul class="qe-table">'];
  for (var param in explorer.coreapi.dataQuery.query) {
    var row = [
      '<li class="qe-row">',
      explorer.queryConfig[param].req ? '<div class="qe-asterisk">*</div>' : '',
      '<label class="qe-table-c1">',
      param,
      '</label>',
      '<div class="qe-table-c2">=</div>',
      '<input type="text" class="queryInput" style="width:',
      explorer.queryConfig[param].size, 'px" id="', param, '"/>',
      '</li>'
    ].join('');
    html.push(row);
  }
  html.push('</ul>');
  $('#queryParams').html(html.join(''));

  // Add a click handler to all the inputboxes to update their
  // respective query model params.
  $('.queryInput').keyup(function() {
    explorer.coreapi.dataQuery.setParam(this.id, this.value);
  });
};


/**
 * Executes a query to retrieve al the logged in user's segments.
 */
explorer.coreapi.queryForSegmentDropdown = function() {
  $('#segment').addClass('small-loader').removeClass('dd-dropInput');
  gapi.client.analytics.management.segments.list().execute(
      explorer.coreapi.handleSegmentResults);
};


/**
 * Handler for when the API returns with segment data.
 * If an error occurs, it's displayed to the user.
 * Otherwise, explorer.coreapi.SegmentsDropdown is initialized and bound to the
 * segment input.
 * @param {object} results The results returned from the segment
 *     query to the Management API.
 */
explorer.coreapi.handleSegmentResults = function(results) {
  $('#segment').removeClass('small-loader').addClass('dd-dropInput');

  if (results.error) {
    var errorMsg = [
      results.code, ' : ', results.message, '<br>',
      'No drop down will be loaded for segments <br>',
      'You can now write your own segment expressions.<br>',
      'Refresh the page to try loading them again.'
    ].join('');

    var error_results = {
      'items': [{
         'name': 'There was an error retrieving segments.',
         'segmentId': ''
       }]
    };
    explorer.coreapi.segmentDropdown.updateValues(error_results);
    explorer.coreapi.displayErrorMessage(errorMsg);
  } else {
    explorer.coreapi.segmentDropdown.updateValues(results);
  }
};


/**
 * Transforms the explorer.queryConfig.help parameter into an HTML string
 * to display the text. Since there are many parts to describe each parameter,
 * it's faster to add the HTML markup once and reference, than to create on the
 * fly. To save space, the existing help text is overwritten.
 */
explorer.coreapi.createHelpText = function() {
  if (!explorer.queryConfig) {
    return;
  }

  for (var param in explorer.queryConfig) {
    var obj = explorer.queryConfig[param];
    obj.help = [
      '<div class="name">', param, '</div>',
      '<em class="req">(',
      (obj.req) ? 'Required' : 'Optional',
      ')</em><br/>',
      '<p class="desc">', obj.help, '</p>',
      '<p><strong>example</strong><br/>', obj.example, '</p>',
      '<a class="docLink" target="blank" href="', explorer.coreapiRefUrl,
      obj.anchor, '">',
      'Read the reference for ', param, '</a>'
    ].join('');
  }
};


/**
 * Adds fancy mouse over effects to the rows in the query builder.
 * On the mouseover event handler, the help information for the currently
 * moused over parameter is displayed. This method also adds mouseover
 * capability to the buttons on the page since IE doesn't know how to practice
 * standards.
 */
explorer.coreapi.addFancyRollOvers = function() {
  $('.qe-table li').mouseover(function() {
    $(this).addClass('highlight');

    // Update the help information.
    var paramName = $(this).children('input').attr('id');
    $('#gaHelp').html(explorer.queryConfig[paramName].help).show();
  }).mouseout(function() {
    $(this).removeClass('highlight');
  });

  $('.submitBtn').hover(function() {
    $(this).addClass('submitBtnHover');
  }, function() {
    $(this).removeClass('submitBtnHover');
  });
};

/**
 * Initialize the Data Query.
 */
explorer.coreapi.initDataQuery = function() {
  explorer.coreapi.dataQuery.setObj({
    'max-results': explorer.coreapi.MAX_QUERY_RESULTS
  });
  explorer.coreapi.dataQuery.setObjFromDeepLink(document.location.href);
};

/**
 * Updates the UI based on the data query configuration.
 */
explorer.coreapi.updateUiFromDataQuery = function() {
  var queryObj = explorer.coreapi.dataQuery.getQueryObj();
  for (var param in queryObj) {
    document.getElementById(param).value = queryObj[param];
  }
};


/**
 * Adds JQuery datepicker control to the input text boxes. If a
 * value exists in the input box, it is selected by default in the calendar.
 * If there is no value the default date range is set as the last 14 days.
 * @param {string} inputId the id of the input text to add a calendar to.
 */
explorer.coreapi.displayDatePicker = function(inputId) {
  var input = document.getElementById(inputId);
  $(input).datepicker({
    dateFormat: 'yy-mm-dd',
    showButtonPanel: true,
    changeMonth: true,
    changeYear: true,
    onSelect: function() {
      $(input).keyup(); // Update the object and other controls.
    }
  });

  // If a date exists in the input box.
  if (!input.value) {
    var defaultRange = (inputId == 'start-date') ? '-14' : '0';
    $(input).datepicker('setDate', defaultRange);
    var myDate = $(input).datepicker('getDate');
    input.value = $.datepicker.formatDate('yy-mm-dd', myDate);
    $(input).keyup();  // Update the object and other controls.
  }
};


/**
 * Adds a click handler for the getData button.
 */
explorer.coreapi.setupUiLinkHandlers = function() {
  $('#getData').click(explorer.coreapi.getApiData);
};

/**
 * Sets up all the handlers for working with bubbles.
 */
explorer.coreapi.setupBubbleHandlers = function() {
  /*
   * Binds a click handler to the document to close bubbles. If a bubble
   * is open, and a click occurs outsie the bubble, all bubbles close.
   * If a bubble is opened, and a different bubble is clicked open,
   * this first bubble is closed.
   */
  $(document).bind('click.bub', function(e) {
    var foundDivs = $(e.target).closest('#deepDiv,#queryUriDiv');
    if (foundDivs.length === 0) {
      $('.ga-bubble').hide();
    } else {
      if (foundDivs[0].id == 'deepDiv') {
        $('#queryUriBubble').hide();
      } else {
        $('#shareBubble').hide();
      }
    }
  });

  // Auto select the entire deep link url.
  $('#deepLinkUrl').click(function() {
    $(this).select();
  });

  // Handler for deep link.
  $('#shareLink')
      .mouseleave(function() {
        // weak hack to not display the css tool tip when the bubble pops open.
        $('.kd-tooltip').css({'visibility': 'visible'});
      })
      .click(explorer.coreapi.configureShare);

  // Auto select the entire query uri.
  $('#queryUriText').click(function() {
    $(this).select();
  });

  // Handlers for the query uri button.
  $('#queryUri')
      .mouseleave(function() {
        // weak hack to not display the css tool tip when the bubble pops open.
        $('.kd-tooltip').css({'visibility': 'visible'});
      })
      .click(function() {
         $('.kd-tooltip').css({'visibility': 'hidden'});
         $('#queryUriBubble').show();
         var queryUri = explorer.coreapi.dataQuery.getUri();
         $('#queryUriText').val(queryUri).select();
      });
};

/**
 * Configures the Share button
 */
explorer.coreapi.configureShare = function() {
  $('.kd-tooltip').css({'visibility': 'hidden'});
  $('#shareBubble').show();
  var deepLink = explorer.coreapi.dataQuery.getDeepLink(explorer.selfUrl);
  $('#deepLinkUrl').val(deepLink).select();

  gapi.plusone.render('g-plus-div', {
    'size': 'medium',
    'annotation': 'bubble',
    'href': deepLink
  });

};

/**
 * Updates the UI and Queries the Core Reporting API
 */
explorer.coreapi.getApiData = function() {
  if (explorer.coreapi.isRealQuery()) {
    $('#gaOutput').hide(); // Hide existing results.
    $('#loader').show();  // Show the ajax loader.
    $('#sampledData').hide(); // Hide the sampled data msg box.
    $('#csvDownload').hide(); // Hide download csv button.

    // Add a `_src` param to the query object to help track usage.
    var dataParams = explorer.coreapi.dataQuery.getQueryObj();
    dataParams.access_token = gapi.auth.getToken().access_token;
    dataParams._src = 'explorer';

    // Manually make the request (rather than using `gapi.client`)
    // so we can add the `_src` parameter to better track usage.
    // The gapi client library strips out all unrecognized parameters.
    $.ajax({
      url: 'https://content.googleapis.com/analytics/v3/data/ga',
      type: 'GET',
      data: dataParams,
      dataType: 'json',
    })
    .done(explorer.coreapi.displayResults)
    .fail(explorer.coreapi.handleError);
  }
};


/**
 * Extracts the error message from the XHR result and displays it.
 * @param {jqXHR} jqXHR The jQuery XHR object.
 */
explorer.coreapi.handleError = function(jqXHR) {
  var error = jqXHR.responseJSON.error;
  var message = error.code + ' : ' + error.message;
  explorer.coreapi.displayErrorMessage(message);
};


/**
 * Displays API error messages. It is called from the explorer api class.
 * This also hides the sampling message if it was shown before.
 * @param {String} errorMsg A message to return to the user.
 */
explorer.coreapi.displayErrorMessage = function(errorMsg) {
  // Hide ajax loader.
  $('#loader').hide();
  $('#sampledData').hide();
  $('#csvDownload').hide();
  $('#gaOutput').html([
    '<strong>Ack! There was an error!</strong><br><br>',
    explorer.util.htmlEscape(errorMsg)
  ].join('')).show();
};


/**
 * Generates the HTML to display some metadata and data table for a Core
 * Reporting API Query.
 * @param {Object} results A JSON response from a Core Reporting API Query.
 */
explorer.coreapi.displayResults = function(results) {

  var rowLength = 0;
  if (results.rows && results.rows.length) {
    rowLength = results.rows.length;
  }

  var conjunction = 'but';
  if (results.totalResults == rowLength) {
    conjunction = 'and';
  }

  var html = [
    '<p id="resultsInfo">Your query matched ', results.totalResults,
    ' results ', conjunction, ' the API only returned the following ',
    rowLength, ' results:</p><div id="resultTable"></div>'].join('');
  $('#gaOutput').html(html);


  var dataTable = explorer.util.getDataTableFromCoreApi(results);
  var tableViz = new google.visualization.Table(
       document.getElementById('resultTable'));

  $('#loader').hide();  // hide ajax loader

  // Handle Sampled Data
  if (results.containsSampledData) {
    $('#sampledData').show();
  } else {
    $('#sampledData').hide();
  }

  tableViz.draw(dataTable);
  $('#gaOutput').show();

  explorer.coreapi.download();
  $('#csvDownload').click(explorer.coreapi.download);
};

/**
 * Generate the URL for the CSV Download link.
 */
explorer.coreapi.initCsvDownloadLink = function() {
  if (document.createElement('a').download !== undefined) {
    explorer.coreapi.downloadSupported = true;
    window.URL = window.webkitURL || window.URL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
        window.MozBlobBuilder;

  }
};

/**
 * Generates the CSV download button
 */
explorer.coreapi.download = function() {
  var token = gapi.auth.getToken();
  var access = token.access_token;

  var query = explorer.coreapi.dataQuery.getParamString(true);
  query += '&access_token=' + access;

  var anchor = document.getElementById('csvDownload');
  anchor.href = '/explorer/csvhandler.csv?' + query;
  $('#csvDownload').css('display', 'block');
};

/**
 * Checks for a Ken vs Ryu Query
 * @return {Boolean} true if the query is legit, false if a haduken is needed.
 */
explorer.coreapi.isRealQuery = function() {

  var query = explorer.coreapi.dataQuery.getQueryObj();
  if (query.dimensions &&
      (query.dimensions.indexOf('ga:ryu') > -1 ||
       query.dimensions.indexOf('ga:ken') > -1)) {

      // Only support Chrome where there is a good experience.
      if (typeof document.body.style.webkitTransition !== 'undefined') {
        explorer.fun.haduken();
        return false;
      }
  }

  return true;
};
