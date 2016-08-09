/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _accountSummaries = __webpack_require__(1);
	
	var _accountSummaries2 = _interopRequireDefault(_accountSummaries);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A ViewSelector2 component for the Embed API.
	 */
	gapi.analytics.ready(function () {
	
	  gapi.analytics.createComponent('ViewSelector2', {
	
	    /**
	     * Render the view selector instance on the page or update an existing
	     * instance if any options have changed.
	     * @return {ViewSelector2} The instance.
	     */
	    execute: function execute() {
	      this.setup_(function () {
	        this.updateAccounts_();
	        if (this.changed_) {
	          this.render_();
	          this.onChange_();
	        }
	      }.bind(this));
	
	      return this;
	    },
	
	    /**
	     * Extend the base `set` function with some error checking and handling of
	     * ID data.
	     * @extends gapi.analytics.Component.prototype.set
	     * @param {Object} opts The options to set.
	     * @return {ViewSelector2}
	     */
	    set: function set(opts) {
	
	      if (!!opts.ids + !!opts.viewId + !!opts.propertyId + !!opts.accountId > 1) {
	
	        throw new Error('You cannot specify more than one of the following ' + 'options: "ids", "viewId", "accountId", "propertyId"');
	      }
	
	      if (opts.container && this.container) {
	        throw new Error('You cannot change containers once a view selector ' + 'has been rendered on the page.');
	      }
	
	      var prevOpts = this.get();
	
	      if (prevOpts.ids != opts.ids || prevOpts.viewId != opts.viewId || prevOpts.propertyId != opts.propertyId || prevOpts.accountId != opts.accountId) {
	
	        // If new ID data is being set, first unset all existing ID data.
	        // This prevents the problem where you set an account ID then set a
	        // view ID for a new view in a different account. Both IDs should not
	        // persist or there will be problems.
	        prevOpts.ids = null;
	        prevOpts.viewId = null;
	        prevOpts.propertyId = null;
	        prevOpts.accountId = null;
	      }
	
	      // Call super.
	      return gapi.analytics.Component.prototype.set.call(this, opts);
	    },
	
	    /**
	     * Set up the view selector instance with values from the Management API's
	     * accountSummaries.list method via the `accountSummaries` module.
	     * If the user has not authorized, wait until that happens before
	     * requesting the account summaries.
	     * @param {Function} cb A function to be invoked once authorization has
	     *     succeeded and the accountSummaries have been retrieved.
	     */
	    setup_: function setup_(cb) {
	      var self = this;
	
	      var onAuthorize = function onAuthorize() {
	        _accountSummaries2.default.get().then(function (summaries) {
	          self.summaries = summaries;
	          self.accounts = self.summaries.all();
	          cb();
	        }, function (err) {
	          self.emit('error', err);
	        });
	      };
	
	      if (gapi.analytics.auth.isAuthorized()) {
	        onAuthorize();
	      } else {
	        gapi.analytics.auth.on('signIn', onAuthorize);
	      }
	    },
	
	    /**
	     * Update the view selector instance properties with new account
	     * information.
	     */
	    updateAccounts_: function updateAccounts_() {
	
	      var opts = this.get();
	      var ids = getIdProp(opts);
	      var view = void 0,
	          account = void 0,
	          property = void 0;
	
	      // If the user does not have any accounts, emit an error.
	      if (!this.summaries.all().length) {
	        this.emit('error', new Error('This user does not have any ' + 'Google Analytics accounts. You can sign up at ' + '"www.google.com/analytics".'));
	        return;
	      }
	
	      // If there are no id props, set the defaults.
	      if (!ids) {
	        account = this.accounts[0];
	        property = account && account.properties && account.properties[0];
	        view = property && property.views && property.views[0];
	      } else {
	        switch (ids.prop) {
	          case 'viewId':
	            view = this.summaries.getProfile(ids.value);
	            account = this.summaries.getAccountByProfileId(ids.value);
	            property = this.summaries.getWebPropertyByProfileId(ids.value);
	            break;
	          case 'propertyId':
	            property = this.summaries.getWebProperty(ids.value);
	            account = this.summaries.getAccountByWebPropertyId(ids.value);
	            view = property && property.views && property.views[0];
	            break;
	          case 'accountId':
	            account = this.summaries.getAccount(ids.value);
	            property = account && account.properties && account.properties[0];
	            view = property && property.views && property.views[0];
	            break;
	        }
	      }
	
	      if (account || property || view) {
	
	        // Only update if something has changed.
	        if (account != this.account || property != this.property || view != this.view) {
	
	          // Store what value changed.
	          this.changed_ = {
	            account: account && account != this.account,
	            property: property && property != this.property,
	            view: view && view != this.view
	          };
	
	          this.account = account;
	          this.properties = account.properties;
	          this.property = property;
	          this.views = property && property.views;
	          this.view = view;
	          this.ids = view && 'ga:' + view.id;
	        }
	      } else {
	        this.emit('error', new Error('This user does not have access to ' + ids.prop.slice(0, -2) + ' : ' + ids.value));
	      }
	    },
	
	    /**
	     * Render the view selector based on the users accounts and the
	     * pre-defined template. Also add event handlers to watch for
	     * changes.
	     */
	    render_: function render_() {
	
	      var opts = this.get();
	
	      this.container = typeof opts.container == 'string' ? document.getElementById(opts.container) : opts.container;
	
	      this.container.innerHTML = opts.template || this.template;
	      var selects = this.container.querySelectorAll('select');
	
	      var accounts = this.accounts;
	      var properties = this.properties || [{ name: '(Empty)', id: '' }];
	      var views = this.views || [{ name: '(Empty)', id: '' }];
	
	      updateSelect(selects[0], accounts, this.account.id);
	      updateSelect(selects[1], properties, this.property && this.property.id);
	      updateSelect(selects[2], views, this.view && this.view.id);
	
	      selects[0].onchange = this.onUserSelect_.bind(this, selects[0], 'accountId');
	      selects[1].onchange = this.onUserSelect_.bind(this, selects[1], 'propertyId');
	      selects[2].onchange = this.onUserSelect_.bind(this, selects[2], 'viewId');
	    },
	
	    /**
	     * A callback that is invoked from the `execute` method whenever the ID
	     * data has changed. Most of the time this change happens when the user
	     * has selected a new view in the UI, but it can also happen
	     * programmatically via the `set` method.
	     */
	    onChange_: function onChange_() {
	
	      var props = {
	        account: this.account,
	        property: this.property,
	        view: this.view,
	        ids: this.view && 'ga:' + this.view.id
	      };
	
	      if (this.changed_) {
	        if (this.changed_.account) this.emit('accountChange', props);
	        if (this.changed_.property) this.emit('propertyChange', props);
	        if (this.changed_.view) {
	          this.emit('viewChange', props);
	          this.emit('idsChange', props);
	
	          // For backwards compatibility with the original ViewSelector.
	          this.emit('change', props.ids);
	        }
	      }
	
	      this.changed_ = null;
	    },
	
	    /**
	     * The handler assigned to the `onchange` method of each of the select
	     * elements. The context is bound to the view selector instance and it is
	     * invoked with the element and property as its arguments.
	     * @param {HTMLSelectElement} select The select element.
	     * @param {string} property The property key to be set on the instance.
	     */
	    onUserSelect_: function onUserSelect_(select, property) {
	      var data = {};
	      data[property] = select.value;
	
	      this.set(data);
	      this.execute();
	    },
	
	    /**
	     * The html structure used to build the component. Developers can override
	     * this by passing it to the component constructor.  The only requirement
	     * is that the structure contain three selects.  The first will be the
	     * account select, the second will be the property select, and the third
	     * will be the view select. Order is important.
	     */
	    template: '<div class="ViewSelector2">' + '  <div class="ViewSelector2-item">' + '    <label>Account</label>' + '    <select class="FormField"></select>' + '  </div>' + '  <div class="ViewSelector2-item">' + '    <label>Property</label>' + '    <select class="FormField"></select>' + '  </div>' + '  <div class="ViewSelector2-item">' + '    <label>View</label>' + '    <select class="FormField"></select>' + '  </div>' + '</div>'
	  });
	
	  /**
	   * Update a select with the specified options and optionally choose the
	   * selected option based on the matching ID.
	   * @param {HTMLSelectElement} select The select element to update.
	   * @param {Array} options An Array of objects with the keys
	   *     `name` and `id`.
	   * @param {string} [id] An optional value used to determine the selected
	   *     option.
	   */
	  function updateSelect(select, options, id) {
	    select.innerHTML = options.map(function (option) {
	      var selected = option.id == id ? 'selected ' : ' ';
	      return '<option ' + selected + 'value="' + option.id + '">' + option.name + '</option>';
	    }).join('');
	  }
	
	  /**
	   * Given an options object containing a single key that could be either
	   * "ids", "viewId", "propertyId", or "accountId", return a new object
	   * specifying that key in its `prop` property. If the passed property is
	   * "ids" convert it to "viewId".
	   * @param {Object} opts An options object.
	   * @return {Object} An object specifying what ID property and value were
	   *     passed.
	   */
	  function getIdProp(opts) {
	    if (opts.ids || opts.viewId) {
	      return { prop: 'viewId', value: opts.viewId || opts.ids && opts.ids.replace(/^ga:/, '') };
	    } else if (opts.propertyId) {
	      return { prop: 'propertyId', value: opts.propertyId };
	    } else if (opts.accountId) {
	      return { prop: 'accountId', value: opts.accountId };
	    }
	  }
	}); // Copyright 2014 Google Inc. All rights reserved.
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
	
	
	/* global gapi */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
	
	
	/* global gapi */
	
	var AccountSummaries = __webpack_require__(2);
	
	
	var API_PATH = '/analytics/v3/management/accountSummaries';
	
	
	/**
	 * Store the accountSummaries result in a promise so the API isn't
	 * queried unneccesarily.
	 */
	var cache;
	
	
	/**
	 * Make a request to the Management API's accountSummaries#list method.
	 * If the requests returns a partial, paginated response, query again
	 * until the full summaries are retrieved.
	 * @return {goog.Promise} A promise that will be resolved with an
	 *     AccountSummaries instance.
	 */
	function requestAccountSummaries() {
	
	  var promise = gapi.client.request({path: API_PATH})
	      // An extra `then` is needed here because `.list` doesn't return a
	      // "real" promise, just a thenable. Calling `.then` gets us access
	      // to the underlying goog.Promise instance and thus its constructor.
	      .then(function(resp) { return resp; });
	
	  return new promise.constructor(function(resolve, reject) {
	
	    // Store the summaries array in the closure so multiple requests can
	    // concat to it.
	    var summaries = [];
	
	    promise.then(function fn(resp) {
	      var result = resp.result;
	      if (result.items) {
	        summaries = summaries.concat(result.items);
	      }
	      else {
	        reject(new Error('You do not have any Google Analytics accounts. ' +
	            'Go to http://google.com/analytics to sign up.'));
	      }
	
	      if (result.startIndex + result.itemsPerPage <= result.totalResults) {
	        gapi.client.request({
	          path: API_PATH,
	          params: {
	            'start-index': result.startIndex + result.itemsPerPage
	          }
	        })
	        // Recursively call this function until the full results are in.
	        .then(fn);
	      }
	      else {
	        resolve(new AccountSummaries(summaries));
	      }
	    })
	    // Reject the promise if there are any uncaught errors;
	    .then(null, reject);
	  });
	}
	
	
	/**
	 * @module accountSummaries
	 *
	 * This module requires the `gapi.client` library to be loaded on the page
	 * and the user to be authenticated.
	 */
	module.exports = {
	
	  /**
	   * Return the `requestAccountSummaries` promise. If the promise exists,
	   * return it to avoid multiple requests. If the promise does not exist,
	   * initiate the request and cache the promise.
	   *
	   * @param {boolean} noCache When true make a request no matter what.
	   * @return {goog.Promise} A promise fulfilled with an AccountSummaries
	   *     instance.
	   */
	  get: function(noCache) {
	    if (noCache) cache = null;
	    return cache || (cache = requestAccountSummaries());
	  }
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	
	
	/**
	 * @constuctor AccountSummaries
	 *
	 * Takes an array of accounts and writes the following new properties:
	 * `accounts_`, `webProperties_`, `profiles_`, `accountsById_`,
	 * `webPropertiesById_`, and `profilesById_`.
	 * Each of the ___ById properties contains an array of objects where the
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
	 * `profiles` to `views` within the `accounts` array tree.
	
	 * @param {Array} accounts A list of accounts in the format returned by the
	 *     management API's accountSummaries#list method.
	 * @returns {AccountSummaries}
	 */
	function AccountSummaries(accounts) {
	
	  this.accounts_ = accounts;
	  this.webProperties_ = [];
	  this.profiles_ = [];
	
	  this.accountsById_ = {};
	  this.webPropertiesById_ = this.propertiesById_ = {};
	  this.profilesById_ = this.viewsById_ = {};
	
	  for (var i = 0, account; account = this.accounts_[i]; i++) {
	
	    this.accountsById_[account.id] = {
	      self: account
	    };
	
	    if (!account.webProperties) continue;
	
	    // Add aliases.
	    alias(account, 'webProperties', 'properties');
	
	    for (var j = 0, webProperty; webProperty = account.webProperties[j]; j++) {
	
	      this.webProperties_.push(webProperty);
	      this.webPropertiesById_[webProperty.id] = {
	        self: webProperty,
	        parent: account
	      };
	
	      if (!webProperty.profiles) continue;
	
	      // Add aliases.
	      alias(webProperty, 'profiles', 'views');
	
	      for (var k = 0, profile; profile = webProperty.profiles[k]; k++) {
	
	        this.profiles_.push(profile);
	        this.profilesById_[profile.id] = {
	          self: profile,
	          parent: webProperty,
	          grandParent: account
	        };
	      }
	    }
	  }
	}
	
	
	/**
	 * Return a list of all accounts this user has access to.
	 * Since the accounts contain the web properties and the web properties contain
	 * the profiles, this list contains everything.
	 * @return {Array}
	 */
	AccountSummaries.prototype.all = function() {
	  return this.accounts_;
	};
	
	alias(AccountSummaries.prototype, 'all',
	                                  'allAccounts');
	
	
	/**
	 * Return a list of all web properties this user has access to.
	 * @return {Array}
	 */
	AccountSummaries.prototype.allWebProperties = function() {
	  return this.webProperties_;
	};
	
	alias(AccountSummaries.prototype, 'allWebProperties',
	                                  'allProperties');
	
	
	/**
	 * Return a list of all profiles this user has access to.
	 * @return {Array}
	 */
	AccountSummaries.prototype.allProfiles = function() {
	  return this.profiles_;
	};
	
	alias(AccountSummaries.prototype, 'allProfiles',
	                                  'allViews');
	
	
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
	  return this.getProfile(obj.profileId || obj.viewId) ||
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
	
	alias(AccountSummaries.prototype, 'getWebProperty',
	                                  'getProperty');
	
	
	/**
	 * Get a profile given its ID.
	 * @param {string|number} profileId
	 * @return {Object} The profile with the given ID.
	 */
	AccountSummaries.prototype.getProfile = function(profileId) {
	  return this.profilesById_[profileId] &&
	      this.profilesById_[profileId].self;
	};
	
	alias(AccountSummaries.prototype, 'getProfile',
	                                  'getView');
	
	
	/**
	 * Get an account given the ID of one of its profiles.
	 * @param {string|number} profileId
	 * @return {Object} The account containing this profile.
	 */
	AccountSummaries.prototype.getAccountByProfileId = function(profileId) {
	  return this.profilesById_[profileId] &&
	      this.profilesById_[profileId].grandParent;
	};
	
	
	alias(AccountSummaries.prototype, 'getAccountByProfileId',
	                                  'getAccountByViewId');
	
	
	
	/**
	 * Get a web property given the ID of one of its profile.
	 * @param {string|number} profileId
	 * @return {Object} The web property containing this profile.
	 */
	AccountSummaries.prototype.getWebPropertyByProfileId = function(profileId) {
	  return this.profilesById_[profileId] &&
	      this.profilesById_[profileId].parent;
	};
	
	alias(AccountSummaries.prototype, 'getWebPropertyByProfileId',
	                                  'getPropertyByViewId');
	
	
	/**
	 * Get an account given the ID of one of its web properties.
	 * @param {string|number} webPropertyId
	 * @return {Object} The account containing this web property.
	 */
	AccountSummaries.prototype.getAccountByWebPropertyId = function(webPropertyId) {
	  return this.webPropertiesById_[webPropertyId] &&
	      this.webPropertiesById_[webPropertyId].parent;
	};
	
	alias(AccountSummaries.prototype, 'getAccountByWebPropertyId',
	                                  'getAccountByPropertyId');
	
	
	/**
	 * Alias a property of an object using es5 getters. If es5 getters are not
	 * supported, just add the aliased property directly to the object.
	 * @param {Object} object The object for which you want to alias properties.
	 * @param {string} referenceProp The reference property.
	 * @param {string} aliasName The reference property's alias name.
	 */
	function alias(object, referenceProp, aliasName) {
	  if (Object.defineProperty) {
	    Object.defineProperty(object, aliasName, {
	      get: function() {
	        return object[referenceProp];
	      }
	    });
	  }
	  else {
	    object[aliasName] = object[referenceProp];
	  }
	}
	
	
	module.exports = AccountSummaries;


/***/ }
/******/ ]);
//# sourceMappingURL=view-selector2.js.map