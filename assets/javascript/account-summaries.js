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


/* jshint boss: true, browser: true */
/* global gapi, gaUtils, Promise, define, module, exports */

/**
 * @module accountSummaries
 *
 * @requires Promise (or a Promise polyfill).
 * @requires gapi.client.analytics (and the user to be authenticated).
 */
(function() {

  var promise;

  /**
   * @constuctor AccountSummaries
   */
  function AccountSummaries(summaries) {
    this.summaries_ = summaries;
    this.setup_();
  }

  /**
   * `setup_` takes the multidimensional summaries_ array property and write
   * the following new properties: `accountsById_`, `webPropertiesById_`, and
   * `profilesById_`.  Each of these contains an array of objects where the
   * key is the entity ID and the value is an object containing the entity and
   * the entity's parents. For example, an object in the `profilesById_` array
   * might look like this:
   *     {
   *       "1234": {
   *         self: {...},
   *         parent: {...},
   *         grandParent: {...}
   *       }
   *     }
   *
   * It also aliases the properties `webProperties` to `properties` and
   * `profiles` to `views`.
   *
   * @private
   */
  AccountSummaries.prototype.setup_ = function() {

    this.accountsById_ = {};
    this.webPropertiesById_ = this.propertiesById_ = {};
    this.profilesById_ = this.viewsById_ = {};

    for (var i = 0, account; account = this.summaries_[i]; i++) {
      this.accountsById_[account.id] = {
        self: account
      };
      if (!account.webProperties) continue;

      // Add aliases.
      account.properties = account.webProperties;

      for (var j = 0, webProperty;
          webProperty = account.webProperties[j]; j++) {
        this.webPropertiesById_[webProperty.id] = {
          self: webProperty,
          parent: account
        };
        if (!webProperty.profiles) continue;

        // Add aliases.
        webProperty.views = webProperty.profiles;

        for (var k = 0, profile; profile = webProperty.profiles[k]; k++) {
          this.profilesById_[profile.id] = {
            self: profile,
            parent: webProperty,
            grandParent: account
          };
        }
      }
    }
  };

  /**
   * Return the raw accountSummaries array as returned by the API.
   * @return {Array}
   */
  AccountSummaries.prototype.all = function() {
    return this.summaries_;
  };


  /**
   * Returns an account, web property or profile given the passed ID in the
   * `idData` object.  The ID data object can contain only one of the
   * following properties: "accountId", "webPropertyId", "propertyId",
   * "profileId", or "viewId".  If more than one key is passed, an error is
   * thrown.
   *
   * @param {Object} obj An object with no more than one of the following
   *     keys: "accountId", "webPropertyId", "propertyId", "profileId" or
   *     "viewId".
   * @return {Object|undefined} The matching account, web property, or
   *     profile. If none are found, undefined is returned.
   */
  AccountSummaries.prototype.get = function(obj) {
    if (!!obj.accountId +
        !!obj.webPropertyId +
        !!obj.propertyId +
        !!obj.profileId +
        !!obj.viewId > 1) {

      throw new Error('get() only accepts an object with a single ' +
          'property: either "accountId", "webPropertyId", "propertyId", ' +
          '"profileId" or "viewId"');
    }
    return this.getProfile(obj.profileIdi || obj.viewId) ||
        this.getWebProperty(obj.webPropertyId || obj.propertyId) ||
        this.getAccount(obj.accountId);
  };


  /**
   * Get an account given its ID.
   * @param {string|number} accountId
   * @return {Object} The account with the given ID.
   */
  AccountSummaries.prototype.getAccount = function(accountId) {
    return this.accountsById_[accountId] &&
        this.accountsById_[accountId].self;
  };


  /**
   * Get a web property given its ID.
   * @param {string} webPropertyId
   * @return {Object} The web property with the given ID.
   */
  AccountSummaries.prototype.getWebProperty = function(webPropertyId) {
    return this.webPropertiesById_[webPropertyId] &&
        this.webPropertiesById_[webPropertyId].self;
  };


  /**
   * Get a profile given its ID.
   * @param {string|number} profileId
   * @return {Object} The profile with the given ID.
   */
  AccountSummaries.prototype.getProfile = function(profileId) {
    return this.profilesById_[profileId] &&
        this.profilesById_[profileId].self;
  };


  /**
   * Get an account given the ID of one of its profiles.
   * @param {string|number} profileId
   * @return {Object} The account containing this profile.
   */
  AccountSummaries.prototype.getAccountByProfileId = function(profileId) {
    return this.profilesById_[profileId] &&
        this.profilesById_[profileId].grandParent;
  };


  /**
   * Get a web property given the ID of one of its profile.
   * @param {string|number} profileId
   * @return {Object} The web property containing this profile.
   */
  AccountSummaries.prototype.getWebPropertyByProfileId = function(profileId) {
    return this.profilesById_[profileId] &&
        this.profilesById_[profileId].parent;
  };


  /**
   * Get an account given the ID of one of its web properties.
   * @param {string|number} webPropertyId
   * @return {Object} The account containing this web property.
   */
  AccountSummaries.prototype.getAccountByWebPropertyId =
      function(webPropertyId) {

    return this.webPropertiesById_[webPropertyId] &&
        this.webPropertiesById_[webPropertyId].parent;
  };


  /**
   * Alias getWebProperty to getProperty.
   */
  AccountSummaries.prototype.getProperty =
      AccountSummaries.prototype.getWebProperty;


  /**
   * Alias getProfile to getView.
   */
  AccountSummaries.prototype.getView =
      AccountSummaries.prototype.getProfile;


  /**
   * Alias getWebPropertyByProfileId to getPropertyByViewId.
   */
  AccountSummaries.prototype.getPropertyByViewId =
    AccountSummaries.prototype.getWebPropertyByProfileId;


  /**
   * Alias getAccountByProfileId to getAccountByViewId.
   */
  AccountSummaries.prototype.getAccountByViewId =
      AccountSummaries.prototype.getAccountByProfileId;


  /**
   * Alias getWebPropertyByProfileId to getPropertyByViewId.
   */
  AccountSummaries.prototype.getWebPropertyByProfileId =
      AccountSummaries.prototype.getPropertyByViewId;


  /**
   * Make a request to the Management API's accountSummaries#list method.
   * If the requests returns a partial, paginated response, query again
   * until the full summaries are retrieved.
   * @return {Promise} A promise that will be resolved once all requests
   *   are complete.
   */
  function requestAccountSummaries() {
    return new Promise(function(resolve) {
      var summaries = [];
      function makeRequest(startIndex) {
        gapi.client.analytics.management.accountSummaries
            .list({'start-index': startIndex || 1})
            .execute(ensureComplete);
      }
      function ensureComplete(resp) {
        // Reject the promise if the API returns an error.
        if (resp.error) throw new Error(resp.message);

        if (resp.items) {
          summaries = summaries.concat(resp.items);
        }
        else {
          throw new Error('You do not have any Google Analytics accounts. ' +
              'Go to http://google.com/analytics to sign up.');
        }

        if (resp.startIndex + resp.itemsPerPage <= resp.totalResults) {
          makeRequest(resp.startIndex + resp.itemsPerPage);
        }
        else {
          resolve(new AccountSummaries(summaries));
        }
      }
      makeRequest();
    });
  }

  var accountSummaries = {

    /**
     * Expose the constructor in case anyone needs it.
     */
    AccountSummaries: AccountSummaries,

    /**
     * Return the `requestAccountSummaries` promise. If the promise exists,
     * return it to avoid multiple requests. If the promise does not exist,
     * initiate the request and cache the promise.
     *
     * @param {boolean} noCache When true make a request no matter what.
     * @return {Promise} A promise fulfilled with the decorated summaries
     *     array.
     */
    get: function(noCache) {
      if (noCache) promise = null;
      return promise || (promise = requestAccountSummaries());
    }
  };


  // AMD Export.
  if (typeof define === 'function' && define.amd) {
      define([], accountSummaries);
  }
  // Node export.
  else if (typeof exports === 'object') {
    module.exports = accountSummaries;
  }
  // Browser global (default to `gaUtils.accountSummaries`).
  else {
    window.gaUtils = window.gaUtils || {};
    gaUtils.accountSummaries = accountSummaries;
  }

}(this));

