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


/**
 * @fileoverview This file provides a class to simplify constructing Google
 * Analytics Data Export API Queries. It contains an object to hold all the
 * important query parameters as well as methods to set and extract the feed
 * url.
 * @author api.nickm@google.com (Nick Mihailovski)
 */

// create a namespace if not done already
var explorer = explorer || {};


/**
 * Class DataQuery holds all the parameters and values for a GA API data
 * feed query. It also exposes methods to simplify setting and retrieving
 * the parameters to be used with the API.
 * @return {Object} A reference to this objecy. Useful for chaining.
 * @constructor
 */
explorer.DataQuery = function() {
  this.query = {};
  for (var param in explorer.queryConfig) {
    this.query[param] = '';
  }
  return this;
};


/**
 * Generic setter method for the parameters in the query object. Only
 * parameters that exist in this Classes query object may be set.
 * @param {string} param The parameter to modify.
 * @param {string} value The value to set the parameter.
 * @return {Object} A reference to this objecy. Useful for chaining.
 */
explorer.DataQuery.prototype.setParam = function(param, value) {
  if (typeof this.query[param] === 'string') {
    this.query[param] = value;
  }
  return this;
};


/**
 * This method sets all the parameters of the query object with the
 * values of the parameter passed in.
 * @param {Object} obj An object with members and values to be mapped
 *     to the query obejct.
 * @return {Object} A reference to this objecy. Useful for chaining.
 */
explorer.DataQuery.prototype.setObj = function(obj) {
  for (var param in obj) {
    this.setParam(param, obj[param]);
  }
  explorer.pubsub.publish(explorer.pubsub.DATA_QUERY_UPDATE);
  return this;
};


/**
 * This method sets the query object from the string generated from
 * the getDeepLink method.
 * @param {string} url The url generated from the deep link.
 * @return {Object} A reference to this objecy. Useful for chaining.
 */
explorer.DataQuery.prototype.setObjFromDeepLink = function(url) {
  // get query param
  var query = url.split('?')[1];

  // if there is an actual query parameter it will evaluate to true.
  if (query) {
    // remove hash
    query = query.split('#')[0];
    var params = decodeURI(query).split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      this.setParam(param[0], decodeURIComponent(param[1]));
    }
  }
  explorer.pubsub.publish(explorer.pubsub.DATA_QUERY_UPDATE);
  return this;
};


/**
 * Returns the query parameters as a String to be used as a query for the
 * Google Analytics API data feed. It also encodes the filter
 * parameter. Only parameters that have values are returned.
 * @return {String} URI encoded String.
 */
explorer.DataQuery.prototype.getUri = function() {
  var params = this.getParamString(true);
  return [explorer.CORE_REPORTING_API, '?', params].join('');
};


/**
 * Returns the string to be used with deep linking to this query.
 * @param {string} url The url to deep link this query to.
 * @param {?boolean} opt_showIds Whether to include the ids parameter.
 * @return {string} URI encoded String.
 */
explorer.DataQuery.prototype.getDeepLink = function(url, opt_showIds) {
  var showIds = opt_showIds || false;
  var params = this.getParamString(showIds);
  return [url, '?', encodeURI(params)].join('');
};


/**
 * This method returns all of the GA query parameters as a string to be used
 * in a url.
 * @param {boolean} showIds True when showing the account id parameter
 *     (ids) in the returned string. To be used with deep linking.
 * @return {string} All the query parameters as a string to be used in a
 *     url.
 */
explorer.DataQuery.prototype.getParamString = function(showIds) {
  var output = [];
  for (var param in this.query) {
    var value = this.query[param];
    if (param == 'ids' && !showIds) {
      continue;
    }
    if (value) {
      output.push([param, '=', encodeURIComponent(value)].join(''));
    }
  }
  return output.join('&');
};

/**
 * Returns all of the GA query parameters as an object.
 * @return {boolean} All the query parameters as an object.
 */
explorer.DataQuery.prototype.getQueryObj = function() {
  var obj = {};
  for (var param in this.query) {
    if (this.query[param] !== '') {
      obj[param] = this.query[param];
    }
  }
  return obj;
};



