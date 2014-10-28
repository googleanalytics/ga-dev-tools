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


/* global explorer, gapi */

/**
 * Auth Configuration
 * @type {Object}
 */
explorer.auth = explorer.auth || {};


/**
 * Analytics API Key.
 * @type {String}
 */
// TODO(philipwalton): Figure out how to assign this in the template.
explorer.auth.API_KEY = 'AIzaSyAuFQbCnospjGuTyjGTIgW_RoocFZ9KGus';

/**
 * Analytics Client ID.
 * @type {String}
 */
// explorer.auth.CLIENT_ID = '748720302078.apps.googleusercontent.com';


/**
 * Initialized the authorization UI and determines whether the user is
 * already authorized. This should be called after the google-api-javascript
 * client library has loaded. This method adds a click handler to the login
 * button. It then makes a call to the authorization service to see whether
 * the user is currently authorized. explorer.auth.handleAuthResult is executed
 * once the authorization response returns.
 */
explorer.auth.init = function() {
  explorer.pubsub.subscribe(explorer.pubsub.LIBS_LOADED, function() {

    gapi.analytics.ready(function() {
      if (gapi.analytics.auth.isAuthorized()) {
        explorer.pubsub.publish(explorer.pubsub.HAS_AUTH);
      }
      else {
        gapi.analytics.auth.on('success', function() {
          explorer.pubsub.publish(explorer.pubsub.HAS_AUTH);
        });
        gapi.analytics.auth.on('error', function() {
          explorer.pubsub.publish(explorer.pubsub.HAS_NO_AUTH);
        });
      }
    });
  });
};

