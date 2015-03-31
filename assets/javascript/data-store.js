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
 * The current version of the storage schema.
 */
const SCHEMA_VERSION = 1;


/**
 * The key used to save data to local storage.
 */
const APP_NAMESPACE = 'ga-dev-tools';


/**
 * A cache of the fetched data to avoid multiple local storage lookups.
 */
let cache;


/**
 * Functions to migrate from a particular version of the schema to the next
 * version. When running migrations, each function is executed in order until
 * the schema is current.
 */
let migrationFunctions = {
  // Version `0` means no schema detected or the original Query Explorer data.
  0: function() {
    let data = JSON.parse(localStorage.getItem('mgmtData'));
    if (data && data.profileId) {
      cache['query-explorer:params'] = {
        ids: 'ga:' + data.profileId
      };
    }
    localStorage.removeItem('mgmtData');
  }
};


/**
 * Ensure that the cache object is populated with data from local storage.
 * Also verify that the schema is current and upgrade if it's not.
 */
function ensureCache() {
  if (!cache) {
    cache = JSON.parse(localStorage.getItem(APP_NAMESPACE)) || {};
  }
  verifySchema();
}


/**
 * Verifies that the schema version stored in local storage is current.
 * If it's not, migrate the schema to the current version.
 */
function verifySchema() {
  cache.version_ = cache.version_ || 0;
  if (cache.version_ < SCHEMA_VERSION) {
    migrate(cache.version_);
  }
}


/**
 * Run the migration fuctions from the version in local storage to the current
 * version.
 */
function migrate(fromVersion) {
  while (fromVersion < SCHEMA_VERSION) {
    migrationFunctions[fromVersion]();
    fromVersion++;
  }
  cache.version_ = SCHEMA_VERSION;
  saveCache();
}


/**
 * Save the data in the cache back to local storage.
 */
function saveCache() {
  localStorage.setItem(APP_NAMESPACE, JSON.stringify(cache));
}


export default {

  /**
   * Get the data from local storage for a given project.
   * Data is cached for quicker access.
   * @param {string} project The project name.
   */
  get: function(project) {
    ensureCache();
    return cache[project];
  },


  /**
   * Store the passed data in localStorage.
   * Note: this overwrites any previous data.
   * @param {string} project The project name.
   * @param {Object} data The data to store.
   */
  set: function(project, data) {
    ensureCache();
    cache[project] = data;
    saveCache();
  }

};
