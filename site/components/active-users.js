gapi.analytics.ready(function() {

  gapi.analytics.createComponent('ActiveUsers', {

    initialize: function(options) {

      // Allow container to be a string ID or an HTMLElement.
      this.container = typeof options.container == 'string' ?
        document.getElementById(options.container) : options.container;

      this.polling = false;
      this.activeUsers = 0;
    },

    execute: function() {
      // Stop any polling currently going on.
      if (this.polling) this.stop();

      // Wait until the user is authorized.
      if (gapi.analytics.auth.isAuthorized()) {
        this.getActiveUsers();
      }
      else {
        gapi.analytics.auth.once('success', this.getActiveUsers.bind(this));
      }
    },

    stop: function() {
      clearTimeout(this.timeout);
      this.polling = false;
      this.emit('stop', {activeUsers: this.activeUsers});
    },

    getActiveUsers: function() {
      var options = this.get();
      var pollingInterval = (options.pollingInterval || 5) * 1000

      if (!(pollingInterval >= 1000)) {
        throw new Error('Frequency cannot be less than 1 second.');
      }

      this.polling = true;
      gapi.client.analytics.data.realtime
        .get({ids:options.ids, metrics:'rt:activeUsers'})
        .execute(function(response) {
          var value = response.totalResults ? +response.rows[0][0] : 0;

          if (value > this.activeUsers) this.onIncrease();
          if (value < this.activeUsers) this.onDecrease();

          this.activeUsers = value;
          this.container.innerHTML = value;

          if (this.polling = true) {
            this.timeout = setTimeout(this.getActiveUsers.bind(this),
                pollingInterval);
          }
        }.bind(this));
    },

    onIncrease: function() {
      this.emit('increase', {activeUsers: this.activeUsers});
      this.emit('change', {
        activeUsers: this.activeUsers,
        direction: 'increase'
      });
    },

    onDecrease: function() {
      this.emit('decrease', {activeUsers: this.activeUsers});
      this.emit('change', {
        activeUsers: this.activeUsers,
        direction: 'decrease'
      });
    }

  });

});
