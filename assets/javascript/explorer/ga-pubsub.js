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


/* global explorer */

/**
 * Namespace for pubsub config object
 */
explorer.pubsub = explorer.pubsub || {};

/**
 * Status for authorized.
 */
explorer.pubsub.HAS_AUTH = 'isAuthorized';


/**
 * Status for not authorized.
 */
explorer.pubsub.HAS_NO_AUTH = 'isNotAuthorized';


/**
 * Status for libraries successfult loaded.
 */
explorer.pubsub.LIBS_LOADED = 'libsLoaded';


/**
 * Status for a query updated.
 */
explorer.pubsub.DATA_QUERY_UPDATE = 'dataQueryUpdate';


/**
 * Config object
 */
explorer.pubsub.map = {};

/**
 * Subscribes.
 * @param {String} key The name of the function.
 * @param {Object} func The function to subscribe to.
 */
explorer.pubsub.subscribe = function(key, func) {
  if (!explorer.pubsub.map[key]) {
    explorer.pubsub.map[key] = [];
  }
  explorer.pubsub.map[key].push(func);
};


/**
 * Publish
 * @param {String} key The name of function to publish.
 */
explorer.pubsub.publish = function(key) {
  if (explorer.pubsub.map[key] && explorer.pubsub.map[key].length) {
    for (var i = 0, func; func = explorer.pubsub.map[key][i]; ++i) {
      func();
    }
  }
};

