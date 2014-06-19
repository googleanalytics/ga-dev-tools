gapi.analytics.ready(function() {

  gapi.analytics.createComponent('Viewpicker', {

    /**
     * Initialize the Viewpicker instance and render it to the page.
     * If the user is not authorized, wait until authorization to render.
     * @return {Viewpicker} The instance.
     */
    execute: function() {
      var options = this.get();
      // Allow container to be a string ID or an HTMLElement.
      this.container = typeof options.container == 'string' ?
        document.getElementById(options.container) : options.container;
      // Allow the template to be overridden.
      if (options.template) this.template = options.template

      if (gapi.analytics.auth.isAuthorized()) {
        this.build();
      }
      else {
        gapi.analytics.auth.on('success', this.build.bind(this));
      }

      return this;
    },

    /**
     * Build the viewpicker instance by querying for the account
     * summaries, rendering them to the page, and then triggering
     * an initial change event (since the first view is selected
     * by default)
     */
    build: function() {
      var self = this;
      accountSummaries.get().then(function(accounts) {
        self.accounts = accounts;
        self.render();
        self.onChange();
      })
      .catch(function(err) {
        console.error(err.stack);
      });
    },

    /**
     * Render the viewpicker based on the users accounts and the
     * pre-defined template. Also add event handlers to watch for
     * changes.
     */
    render: function() {

      this.container.innerHTML = this.template;

      var self = this;
      var accounts = this.accounts;
      var properties = this.accounts[0].properties;
      var views = properties[0].views;
      var selects = this.container.querySelectorAll('select');

      this.accountSelect = selects[0];
      this.propertySelect = selects[1];
      this.viewSelect = selects[2];

      updateSelectOptions(this.accountSelect, accounts);
      updateSelectOptions(this.propertySelect, properties);
      updateSelectOptions(this.viewSelect, views);

      this.accountSelect.onchange = this.onAccountChange.bind(this);
      this.propertySelect.onchange = this.onPropertyChange.bind(this);
      this.viewSelect.onchange = this.onViewChange.bind(this);
    },

    /**
     * Emit a change event based on the currently selected account,
     * property, and view. Pass an object containing the account name,
     * property name, view name, and ids.
     */
    onChange: function() {
      var accountIndex = +this.accountSelect.value;
      var propertyIndex = +this.propertySelect.value;
      var viewIndex = +this.viewSelect.value;

      var account = this.accounts[accountIndex];
      var property = account.properties[propertyIndex];
      var view = property.views[viewIndex];

      this.accountName = account.name;
      this.propertyName = property.name;
      this.viewName = view.name;
      this.ids = view.ids;

      this.emit('change', {
        accountName: account.name,
        propertyName: property.name,
        viewName: view.name,
        ids: view.ids
      });
    },

    /**
     * A callback to be invoked when the user change the account select.
     */
    onAccountChange: function() {
      var accountIndex = +this.accountSelect.value;
      var account = this.accounts[accountIndex];

      updateSelectOptions(this.propertySelect, account.properties);
      updateSelectOptions(this.viewSelect, account.properties[0].views);

      this.onChange();
    },

    /**
     * A callback to be invoked when the user change the property select.
     */
    onPropertyChange: function() {
      var propertyIndex = +this.propertySelect.value;
      var accountIndex = +this.accountSelect.value;
      var account = this.accounts[accountIndex];
      var property = account.properties[propertyIndex];
      updateSelectOptions(this.viewSelect, property.views);

      this.onChange();
    },

    /**
     * A callback to be invoked when the user change the view select.
     */
    onViewChange: function() {
      this.onChange();
    },

    /**
     * The html structure used to build the component. Developers can
     * override this by passing it to the component constructor.
     * The only requirement is that the structure contain three selects.
     * The first will be the account select, the second will be the
     * property select, and the third will be the view select.
     */
    template:
      '<div class="Viewpicker">' +
      '  <div class="Viewpicker-item">' +
      '    <label>Account</label>' +
      '    <select></select>' +
      '  </div>' +
      '  <div class="Viewpicker-item">' +
      '    <label>Property</label>' +
      '    <select></select>' +
      '  </div>' +
      '  <div class="Viewpicker-item">' +
      '    <label>View</label>' +
      '    <select></select>' +
      '  </div>' +
      '</div>'
  });

  /**
   * Update a select with the specified options from the server.
   * @param {DOMElement} select The select element to update.
   * @param {Array} options An Array of objects with the keys
   *   `name` and `value`.
   */
  function updateSelectOptions(select, options) {
    select.innerHTML = options.map(function(option, i) {
      return '<option value="' + (option.value || i) + '">' +
          option.name + '</option>';
    }).join('');
  }

  /**
   * @module accountSummaries
   */
  var accountSummaries = (function() {

    var promise;

    /**
     * Make a request to the Management API's accountSummaries#list method.
     * If the requests returns a partial, paginated response, query again
     * until the full summaries are retrieved.
     * @return {Promise} A promise that will be resolved once all requests
     *   are complete.
     */
    function requestAccountSummaries() {
      return new Promise(function(resolve, reject) {
        var summaries = [];
        function makeRequest(startIndex) {
          gapi.client.analytics.management.accountSummaries
              .list({'start-index': startIndex || 1})
              .execute(ensureComplete);
        }
        function ensureComplete(resp) {
          // Reject the promise if the API returns an error.
          if (resp.error) return reject(new Error(resp.message));

          if (resp.items) summaries = summaries.concat(resp.items);
          if (resp.startIndex + resp.itemsPerPage <= resp.totalResults) {
            makeRequest(resp.startIndex + resp.itemsPerPage);
          }
          else {
            resolve(summaries);
          }
        }
        makeRequest();
      });
    }

    /**
     * Loop through the full account summaries array and create a new array
     * the only contains the account, property, and view names and their
     * children. Also exclude accounts with no properties as well as properties
     * with no views.
     * @param {Array} oldSummaries The account summaries array in the form
     *   return by the Management API.
     * @return {Array} The trimmed-down account summaries.
     */
    function trimAccountSummaries(oldSummaries) {
      var newSummaries = [];
      oldSummaries.forEach(function(item) {
        var account = {name: item.name, properties: []};
        var properties = item.webProperties || [];
        properties.forEach(function(item) {
          var property = {name: item.name, views: []};
          var views = item.profiles || [];
          views.forEach(function(item) {
            var view = {name: item.name, ids: 'ga:' + item.id};
            property.views.push(view);
          });
          // Only add the property if it has views.
          if (property.views.length) {
            account.properties.push(property);
          }
        });
        // Only add the account if it has properties.
        if (account.properties.length) {
          newSummaries.push(account);
        }
      });
      return newSummaries;
    }

    return {
      /**
       * Return the `requestAccountSummaries` promise. If the promise exists,
       * return it to avoid multiple requests. If the promise does not exist,
       * initiate the request and cache the promise.
       */
      get: function() {
        return promise || (promise =
          requestAccountSummaries()
            .then(trimAccountSummaries)
            .catch(function(err) {
              console.error(err.stack);
            })
          );
      }
    }

  }());

});
