// Copyright 2016 Google Inc. All rights reserved.
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
 * @return {Object} The default storage data.
 */
function getDefaults() {
  return {
    version_: SCHEMA_VERSION,
  };
}


/**
 * Ensure that the cache object is populated with data from local storage.
 * Also verify that the schema is current and upgrade if it's not.
 */
function ensureCache() {
  if (!cache) {
    let storedData;
    try {
      storedData = JSON.parse(localStorage.getItem(APP_NAMESPACE));
    } catch(err) {
      // No action.
    }
    cache = verifySchema(storedData) ? storedData : getDefaults();
  }
}


/**
 * Verifies that the schema version stored in local storage is current.
 * If it's not, migrate the schema to the current version.
 * @param {*} storedData The value to test.
 * @return {boolean} True if the stored data matches the expected schema.
 */
function verifySchema(storedData) {
  // TODO(philipwalton): add migration functions if the schema changes.
  return (storedData &&
      typeof storedData == 'object' &&
      storedData.version_ == SCHEMA_VERSION);
}


/**
 * Save the data in the cache back to local storage.
 */
function saveCache() {
  try {
    localStorage.setItem(APP_NAMESPACE, JSON.stringify(cache));
  } catch(err) {
    // No action.
  }
}


export default {

  /**
   * Get the data from local storage for a given project.
   * Data is cached for quicker access.
   * @param {string} project The project name.
   * @return {Object} The project data.
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
  },

};
