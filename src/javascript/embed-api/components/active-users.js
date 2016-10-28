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


gapi.analytics.ready(function() {
  gapi.analytics.createComponent('ActiveUsers', {

    initialize: function() {
      this.activeUsers = 0;
      gapi.analytics.auth.once('signOut', this.handleSignOut_.bind(this));
    },

    execute: function() {
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

    stop: function() {
      clearTimeout(this.timeout_);
      this.polling_ = false;
      this.emit('stop', {activeUsers: this.activeUsers});
    },

    render_: function() {
      let opts = this.get();

      // Render the component inside the container.
      this.container = typeof opts.container == 'string' ?
          document.getElementById(opts.container) : opts.container;

      this.container.innerHTML = opts.template || this.template;
      this.container.querySelector('b').innerHTML = this.activeUsers;
    },

    pollActiveUsers_: function() {
      let options = this.get();
      let pollingInterval = (options.pollingInterval || 5) * 1000;

      if (isNaN(pollingInterval) || pollingInterval < 5000) {
        throw new Error('Frequency must be 5 seconds or more.');
      }

      this.polling_ = true;
      gapi.client.analytics.data.realtime
          .get({ids: options.ids, metrics: 'rt:activeUsers'})
          .then(function(response) {
        let result = response.result;
        let newValue = result.totalResults ? +result.rows[0][0] : 0;
        let oldValue = this.activeUsers;

        this.emit('success', {activeUsers: this.activeUsers});

        if (newValue != oldValue) {
          this.activeUsers = newValue;
          this.onChange_(newValue - oldValue);
        }

        if (this.polling_ == true) {
          this.timeout_ = setTimeout(this.pollActiveUsers_.bind(this),
              pollingInterval);
        }
      }.bind(this));
    },

    onChange_: function(delta) {
      let valueContainer = this.container.querySelector('b');
      if (valueContainer) valueContainer.innerHTML = this.activeUsers;

      this.emit('change', {activeUsers: this.activeUsers, delta: delta});
      if (delta > 0) {
        this.emit('increase', {activeUsers: this.activeUsers, delta: delta});
      } else {
        this.emit('decrease', {activeUsers: this.activeUsers, delta: delta});
      }
    },

    handleSignOut_: function() {
      this.stop();
      gapi.analytics.auth.once('signIn', this.handleSignIn_.bind(this));
    },

    handleSignIn_: function() {
      this.pollActiveUsers_();
      gapi.analytics.auth.once('signOut', this.handleSignOut_.bind(this));
    },

    template:
      '<div class="ActiveUsers">' +
        'Active Users: <b class="ActiveUsers-value"></b>' +
      '</div>',

  });
});
