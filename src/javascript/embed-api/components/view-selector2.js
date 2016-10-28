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


/* global gapi */


import accountSummaries from 'javascript-api-utils/lib/account-summaries';


/**
 * A ViewSelector2 component for the Embed API.
 */
gapi.analytics.ready(function() {
  gapi.analytics.createComponent('ViewSelector2', {

    /**
     * Render the view selector instance on the page or update an existing
     * instance if any options have changed.
     * @return {ViewSelector2} The instance.
     */
    execute: function() {
      this.setup_(function() {
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
    set: function(opts) {
      if (!!opts.ids +
          !!opts.viewId +
          !!opts.propertyId +
          !!opts.accountId > 1) {
        throw new Error('You cannot specify more than one of the following ' +
            'options: "ids", "viewId", "accountId", "propertyId"');
      }

      if (opts.container && this.container) {
        throw new Error('You cannot change containers once a view selector ' +
            'has been rendered on the page.');
      }

      let prevOpts = this.get();

      if (prevOpts.ids != opts.ids ||
          prevOpts.viewId != opts.viewId ||
          prevOpts.propertyId != opts.propertyId ||
          prevOpts.accountId != opts.accountId) {
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
    setup_: function(cb) {
      let self = this;

      let onAuthorize = function() {
        accountSummaries.get().then(
          function(summaries) {
            self.summaries = summaries;
            self.accounts = self.summaries.all();
            cb();
          },
          function(err) {
            self.emit('error', err);
          }
        );
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
    updateAccounts_: function() {
      let opts = this.get();
      let ids = getIdProp(opts);
      let view;
      let account;
      let property;

      // If the user does not have any accounts, emit an error.
      if (!this.summaries.all().length) {
        this.emit('error', new Error('This user does not have any ' +
            'Google Analytics accounts. You can sign up at ' +
            '"www.google.com/analytics".'));
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
        if (account != this.account ||
            property != this.property ||
            view != this.view) {
          // Store what value changed.
          this.changed_ = {
            account: account && account != this.account,
            property: property && property != this.property,
            view: view && view != this.view,
          };

          this.account = account;
          this.properties = account.properties;
          this.property = property;
          this.views = property && property.views;
          this.view = view;
          this.ids = view && 'ga:' + view.id;
        }
      } else {
        this.emit('error', new Error('This user does not have access to ' +
            ids.prop.slice(0, -2) + ' : ' + ids.value));
      }
    },

    /**
     * Render the view selector based on the users accounts and the
     * pre-defined template. Also add event handlers to watch for
     * changes.
     */
    render_: function() {
      let opts = this.get();

      this.container = typeof opts.container == 'string' ?
          document.getElementById(opts.container) : opts.container;

      this.container.innerHTML = opts.template || this.template;
      let selects = this.container.querySelectorAll('select');

      let accounts = this.accounts;
      let properties = this.properties || [{name: '(Empty)', id: ''}];
      let views = this.views || [{name: '(Empty)', id: ''}];

      updateSelect(selects[0], accounts, this.account.id);
      updateSelect(selects[1], properties, this.property && this.property.id);
      updateSelect(selects[2], views, this.view && this.view.id);

      selects[0].onchange =
          this.onUserSelect_.bind(this, selects[0], 'accountId');
      selects[1].onchange =
          this.onUserSelect_.bind(this, selects[1], 'propertyId');
      selects[2].onchange =
          this.onUserSelect_.bind(this, selects[2], 'viewId');
    },

    /**
     * A callback that is invoked from the `execute` method whenever the ID
     * data has changed. Most of the time this change happens when the user
     * has selected a new view in the UI, but it can also happen
     * programmatically via the `set` method.
     */
    onChange_: function() {
      let props = {
        account: this.account,
        property: this.property,
        view: this.view,
        ids: this.view && 'ga:' + this.view.id,
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
    onUserSelect_: function(select, property) {
      let data = {};
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
    template:
      '<div class="ViewSelector2">' +
      '  <div class="ViewSelector2-item">' +
      '    <label>Account</label>' +
      '    <select class="FormField"></select>' +
      '  </div>' +
      '  <div class="ViewSelector2-item">' +
      '    <label>Property</label>' +
      '    <select class="FormField"></select>' +
      '  </div>' +
      '  <div class="ViewSelector2-item">' +
      '    <label>View</label>' +
      '    <select class="FormField"></select>' +
      '  </div>' +
      '</div>',
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
    select.innerHTML = options.map(function(option) {
      let selected = option.id == id ? 'selected ' : ' ';
      return '<option ' + selected + 'value="' + option.id + '">' +
          option.name + '</option>';
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
      return {prop: 'viewId', value: opts.viewId ||
          (opts.ids && opts.ids.replace(/^ga:/, ''))};
    } else if (opts.propertyId) {
      return {prop: 'propertyId', value: opts.propertyId};
    } else if (opts.accountId) {
      return {prop: 'accountId', value: opts.accountId};
    }
  }
});
