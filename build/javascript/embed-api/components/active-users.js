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
/***/ function(module, exports) {

	'use strict';
	
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
	
	gapi.analytics.ready(function () {
	
	  gapi.analytics.createComponent('ActiveUsers', {
	
	    initialize: function initialize() {
	      this.activeUsers = 0;
	      gapi.analytics.auth.once('signOut', this.handleSignOut_.bind(this));
	    },
	
	    execute: function execute() {
	      // Stop any polling currently going on.
	      if (this.polling_) {
	        this.stop();
	      }
	
	      this.render_();
	
	      // Wait until the user is authorized.
	      if (gapi.analytics.auth.isAuthorized()) {
	        this.pollActiveUsers_();
	      } else {
	        gapi.analytics.auth.once('signIn', this.pollActiveUsers_.bind(this));
	      }
	    },
	
	    stop: function stop() {
	      clearTimeout(this.timeout_);
	      this.polling_ = false;
	      this.emit('stop', { activeUsers: this.activeUsers });
	    },
	
	    render_: function render_() {
	      var opts = this.get();
	
	      // Render the component inside the container.
	      this.container = typeof opts.container == 'string' ? document.getElementById(opts.container) : opts.container;
	
	      this.container.innerHTML = opts.template || this.template;
	      this.container.querySelector('b').innerHTML = this.activeUsers;
	    },
	
	    pollActiveUsers_: function pollActiveUsers_() {
	      var options = this.get();
	      var pollingInterval = (options.pollingInterval || 5) * 1000;
	
	      if (isNaN(pollingInterval) || pollingInterval < 5000) {
	        throw new Error('Frequency must be 5 seconds or more.');
	      }
	
	      this.polling_ = true;
	      gapi.client.analytics.data.realtime.get({ ids: options.ids, metrics: 'rt:activeUsers' }).then(function (response) {
	
	        var result = response.result;
	        var newValue = result.totalResults ? +result.rows[0][0] : 0;
	        var oldValue = this.activeUsers;
	
	        this.emit('success', { activeUsers: this.activeUsers });
	
	        if (newValue != oldValue) {
	          this.activeUsers = newValue;
	          this.onChange_(newValue - oldValue);
	        }
	
	        if (this.polling_ == true) {
	          this.timeout_ = setTimeout(this.pollActiveUsers_.bind(this), pollingInterval);
	        }
	      }.bind(this));
	    },
	
	    onChange_: function onChange_(delta) {
	      var valueContainer = this.container.querySelector('b');
	      if (valueContainer) valueContainer.innerHTML = this.activeUsers;
	
	      this.emit('change', { activeUsers: this.activeUsers, delta: delta });
	      if (delta > 0) {
	        this.emit('increase', { activeUsers: this.activeUsers, delta: delta });
	      } else {
	        this.emit('decrease', { activeUsers: this.activeUsers, delta: delta });
	      }
	    },
	
	    handleSignOut_: function handleSignOut_() {
	      this.stop();
	      gapi.analytics.auth.once('signIn', this.handleSignIn_.bind(this));
	    },
	
	    handleSignIn_: function handleSignIn_() {
	      this.pollActiveUsers_();
	      gapi.analytics.auth.once('signOut', this.handleSignOut_.bind(this));
	    },
	
	    template: '<div class="ActiveUsers">' + 'Active Users: <b class="ActiveUsers-value"></b>' + '</div>'
	
	  });
	});

/***/ }
/******/ ]);
//# sourceMappingURL=active-users.js.map