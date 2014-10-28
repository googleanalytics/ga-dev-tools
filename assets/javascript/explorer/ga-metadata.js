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


/* global $ */

/**
 * @fileoverview Contains all the dimension and metrics groupings and help
 * text from the Metadata API. This is used to dynamically populate the query
 * explorer with data form the Metadata API response.
 * @author pfrisella@google.com (Pete Frisella)
 */

// Default namespace.
var explorer = explorer || {};


/**
 * Namespace for metadata functionality.
 * @type {Object}
 */
explorer.metadata = {};


/**
 * The type value for a dimension column.
 * @type {string}
 * @const
 */
explorer.metadata.DIMENSION = 'DIMENSION';


/**
 * The type value for a metric column.
 * @type {string}
 * @const
 */
explorer.metadata.METRIC = 'METRIC';


/**
 * The status value for a deprecated column.
 * @type {string}
 * @const
 */
explorer.metadata.DEPRECATED = 'DEPRECATED';


/**
 * An object to hold the Google Analytics API dimension descriptions.
 * @type {Object}
 */
explorer.dimensionsHelp = {};


/**
 * An object to hold the Google Analytics API metric descriptions.
 * @type {Object}
 */
explorer.metricsHelp = {};


/**
 * Metadata API request URL.
 * @type {string}
 * @const
 */
explorer.metadata.METADATA_API_URL = [
  'https://www.googleapis.com/analytics/v3/metadata/ga/columns',
  '?key=', explorer.auth.API_KEY].join('');


/**
 * Main initialization function. Querys the Metadata API
 * and ensures that the browser response is not cached; jquery
 * adds cache busting. Once loaded, the explorer.metadata.callback_
 * method is called.
 *
 * @param {string} callbackName The name of the function to execute and pass the
 *    Metadata API response to.
 */
explorer.getMetadata = function(callbackName) {
  $.ajax(explorer.metadata.METADATA_API_URL, {
    'dataType': 'jsonp',
    'jsonpCallback': callbackName
  });
};


/**
 * Builds the metrics and dimensions groups that are used to populate the
 * dropdowns and HTML help content for each column. Once the content is built,
 * the metricsHelp and dimensionsHelp variables are set. These then get used in
 * ga-core.js to populate the dropdowns and set the help text.
 *
 * @param {Object} response The response from the Metadata API.
 */
explorer.metadata.build = function(response) {
  var groups = explorer.metadata.getColumnsByGroup_(response);
  explorer.metricsHelp = groups[explorer.metadata.METRIC];
  explorer.dimensionsHelp = groups[explorer.metadata.DIMENSION];
};


/**
 * Parses the Metadata API response and gets the HTML content to use for each
 * column. Columns are organized by type, group name, and column ID. This object
 * can then be used to populate the Query Explorer dimensions and metrics
 * dropdowns and the help text for each column. Deprecated columns are
 * excluded.
 *
 * @param {Object} response The response from the Metadata API.
 * @return {Object} A collection of column HTML content organized by type, group
 *    name, and ID. Deprecated columns are excluded.
 *    E.g. ['DIMENSION']['Visitors']['ga:visitors'] = '{HTML Help Content}'.
 * @private
 **/
explorer.metadata.getColumnsByGroup_ = function(response) {
  var groups = {};
  groups[explorer.metadata.DIMENSION] = {};
  groups[explorer.metadata.METRIC] = {};

  for (var i = 0, item; item = response.items[i]; ++i) {
    var groupName = item.attributes.group;
    var itemType = item.attributes.type;
    var itemStatus = item.attributes.status;

    if (itemStatus != explorer.metadata.DEPRECATED) {
      if (!groups[itemType][groupName]) {
        groups[itemType][groupName] = {};
      }
      groups[itemType][groupName][item.id] = explorer.metadata.getColumnHtml_(item);
    }
  }
  return groups;
};


/**
 * Returns the HTML content to use for a column. This includes details about the
 * column such as UI name, description, data type, if allowed in segments, and
 * other attributes.
 *
 * @param {Object} item The column from which to get the HTML help content.
 * @return {string} The HTML help content for the column.
 * @private
 */
explorer.metadata.getColumnHtml_ = function(item) {
  var html = [];
  explorer.metadata.buildNameHtml_(item, html);
  explorer.metadata.buildDescriptionHtml_(item, html);
  explorer.metadata.buildCalculationHtml_(item, html);
  explorer.metadata.buildRequiredAttributesHtml_(item, html);
  explorer.metadata.buildIndexRangeHtml_(item, html);
  explorer.metadata.buildPremiumIndexRangeHtml_(item, html);
  return html.join('');
};


/**
 * Builds HTML help content for the column web and app UI names.
 *
 * @param {Object} item The column from which to build the name help content.
 * @param {Array} html HTML content is pushed to this array.
 * @private
 */
explorer.metadata.buildNameHtml_ = function(item, html) {
  html.push('Web View Name: <code>', item.attributes.uiName, '</code><br/>');
  if (!!item.attributes.appUiName) {
    html.push(
        'App View Name: <code>', item.attributes.appUiName,
        '</code><br/>');
  }
  html.push('<br/>');
};


/**
 * Builds HTML help content for the column calculation attribute, if it
 * exists.
 *
 * @param {Object} item The column from which to build the calculation help
 *    content.
 * @param {Array} html HTML content is pushed to this array.
 * @private
 */
explorer.metadata.buildCalculationHtml_ = function(item, html) {
  if (!!item.attributes.calculation) {
    html.push(
        '<br/><br/><strong>Calculation</strong>:<br/>',
        '<code>', item.attributes.calculation, '</code>');
  }
};


/**
 * Builds HTML help content for the column description attribute and replaces
 * URLs in the description with live links that will open in a new window.
 *
 * @param {Object} item The column from which to build the description help
 * content.
 * @param {Array} html HTML content is pushed to this array.
 * @private
 */
explorer.metadata.buildDescriptionHtml_ = function(item, html) {
  var urlRegEx = /(https?:\/\/[^\s]+)/ig;
  var description = item.attributes.description;
  description = description.replace(urlRegEx,
      function(url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
      });
  html.push(description);
};


/**
 * Builds HTML help content for column attributes that are expected to be
 * included in every column: Data type and allowed in segments.
 *
 * @param {Object} item The column from which to build the attribute help
 * content.
 * @param {Array} html HTML content is pushed to this array.
 * @private
 */
explorer.metadata.buildRequiredAttributesHtml_ = function(item, html) {
  html.push(
      '<br/><br/><strong>Attributes</strong>:<br/>',
      'Data Type: <code>', item.attributes.dataType, '</code><br/>',
      'Allowed In Segments: ');
  if (!!item.attributes.allowedInSegments) {
    html.push('Yes');
  } else {
    html.push('No');
  }
  html.push('<br/>');
};


/**
 * Builds HTML help content for column template index range attribute.
 *
 * @param {Object} item The column from which to build the index range help
 *    content.
 * @param {Array} html HTML content is pushed to this array.
 * @private
 */
explorer.metadata.buildIndexRangeHtml_ = function(item, html) {
  if (!!item.attributes.minTemplateIndex &&
      !!item.attributes.maxTemplateIndex) {
    html.push(
        'Index Range: ', item.attributes.minTemplateIndex, ' to ',
        item.attributes.maxTemplateIndex, '<br/>');
  }
};


/**
 * Builds HTML help content for column template premium index range attribute.
 *
 * @param {Object} item The column from which to build the premium index range
 *    help content.
 * @param {Array} html HTML content is pushed to this array.
 * @private
 */
explorer.metadata.buildPremiumIndexRangeHtml_ = function(item, html) {
  if (!!item.attributes.premiumMinTemplateIndex &&
      !!item.attributes.premiumMaxTemplateIndex) {
    html.push(
        'Premium Index Range: ', item.attributes.premiumMinTemplateIndex,
        ' to ', item.attributes.premiumMaxTemplateIndex, '<br/>');
  }
};
