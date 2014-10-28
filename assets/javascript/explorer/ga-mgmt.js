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


/* global $, gapi */

/**
 * Namespace.
 */
var explorer = explorer || {};


/**
 * Config object for Management API queries
 */
explorer.mgmt = explorer.mgmt || {};


/**
 * Used for caching config values for mangement
 */
explorer.mgmt.STORAGE_KEY = 'mgmtData';


/**
 * true if previously selected account details are not available.
 */
explorer.mgmt.isNew = true;


/**
 * Id of the last clicked management resource
 */
explorer.mgmt.clickedId = '';


/**
 * Object to store management query config details
 */
explorer.mgmt.cache = {};


/**
 * Details for the currently selected management resource.
 */
explorer.mgmt.data = {
  'accountId': '',
  'accountName': '',
  'webpropertyId': '',
  'webPropertyName': '',
  'profileId': '',
  'profileName': ''
};


/**
 * The Account dropdown
 */
explorer.mgmt.accountDd = new explorer.Dropdown();


/**
 * The Web Property dropdown
 */
explorer.mgmt.webpropertyDd = new explorer.Dropdown();


/**
 * The Profile dropdown
 */
explorer.mgmt.profileDd = new explorer.Dropdown();


/**
 * Initialized the UI for the account selection managemenet portion of the
 * UI. The user can select an Account, WebProperty and a Profile. When
 * selected, each are added to the explorer.mgmt.data object and stored locally.
 * if the user returns, the data is loaded, then the previous
 * selections are displayed.
 * @param {String} userId The Id of the current user.
 */
explorer.mgmt.init = function() {
  var data = explorer.mgmt.load();
  if (data) {
    explorer.mgmt.isNew = false;
    explorer.mgmt.data = data;
    $('#account').val(explorer.mgmt.data.accountName);
    $('#webproperty').val(explorer.mgmt.data.webpropertyName);
    $('#profile').val(explorer.mgmt.data.profileName);
    explorer.mgmt.updateIds(explorer.mgmt.data.profileId);

  } else {
    $('#account')
        .val('authorize to list accounts')
        .addClass('inputStatusMsg');
  }

  explorer.pubsub.subscribe(explorer.pubsub.HAS_AUTH, explorer.mgmt.setupDropdowns);
};


/**
 * Generates account, property and profile dropdowns.
 */
explorer.mgmt.setupDropdowns = function() {
  if (explorer.mgmt.isNew) {
    explorer.mgmt.loadAccounts();
  } else {
    $('#account').click(explorer.mgmt.handleAccountClick);
    $('#webproperty').click(explorer.mgmt.handleWebpropertyClick);
    $('#profile').click(explorer.mgmt.handleProfileClick);
  }
  $('#account').removeClass('inputStatusMsg');
};


/**
 * Handles clicks on the account dropdown.
 * @param {Object} event The event to be handled.
 */
explorer.mgmt.handleAccountClick = function(event) {
  explorer.mgmt.clickedId = event.target.id;
  explorer.mgmt.loadAccounts();
};


/**
 * Handles clicks on the web property dropdown.
 * @param {Object} event The event to be handled.
 */
explorer.mgmt.handleWebpropertyClick = function(event) {
  explorer.mgmt.clickedId = event.target.id;
  explorer.mgmt.loadWebproperties();
};


/**
 * Handles clicks on the profile dropdown.
 * @param {Object} event The event to be handled.
 */
explorer.mgmt.handleProfileClick = function(event) {
  explorer.mgmt.clickedId = event.target.id;
  explorer.mgmt.loadProfiles();
};


/**
 * Queries the Management API for a list of Accounts for the
 * current user.
 */
explorer.mgmt.loadAccounts = function() {
  $('#account').addClass('small-loader');
  gapi.client.analytics.management.accounts.list().execute(
      explorer.mgmt.handleAccounts);
};


/**
 * Handles the response from a query to the Management API for a list of
 * accounts for the current user.
 * @param {Object} results A Core Reporting API response.
 */
explorer.mgmt.handleAccounts = function(results) {
  $('#account').removeClass('small-loader');
  if (results.error) {
    explorer.mgmt.displayError(results);

  } else if (!results.items || !results.items.length) {
    $('#account').val('No accounts found');

  } else {
    $('#account').addClass('dd-dropInput');

    if (!explorer.mgmt.accountDd.isInit) {
      if (!explorer.mgmt.isNew) {
        $('#account').unbind('click');
      }

      explorer.mgmt.accountDd.init('account');

      if (explorer.mgmt.clickedId == 'account') {
        explorer.mgmt.accountDd.update(results);
        explorer.mgmt.clickedId = '';
        explorer.mgmt.accountDd.open();
        return;
      }
    }

    explorer.mgmt.accountDd.update(results);
    explorer.mgmt.updateUi('account', results.items[0].name, results.items[0].id);

  }
};


/**
 * Queries the Management API for a list of Properties for the
 * current user and selected account.
 */
explorer.mgmt.loadWebproperties = function() {
  // give the associated input box a dropInput class
  $('#webproperty').addClass('small-loader').removeClass('dd-dropInput');

  // Try to retrieve from cache.
  var results = explorer.mgmt.cache[explorer.mgmt.data.accountId];
  if (results) {
    explorer.mgmt.handleWebproperties(results);

  } else {
    // Fetch from API.
    gapi.client.analytics.management.webproperties.list({
      'accountId': explorer.mgmt.data.accountId}).execute(
        explorer.mgmt.handleWebproperties);
  }
};


/**
 * Handles the response from a query to the Management API for a list of
 * properties for the current user and selected account.
 * @param {Object} results A Core Reporting API response.
 */
explorer.mgmt.handleWebproperties = function(results) {
  $('#webproperty').removeClass('small-loader');

  if (results.error) {
    explorer.mgmt.displayError(results);

  } else if (!results.items || !results.items.length) {
    $('#webproperty').val('No web properties found');

  } else {
    $('#webproperty').addClass('dd-dropInput');
    explorer.mgmt.cache[explorer.mgmt.data.accountId] = results;

    if (!explorer.mgmt.webpropertyDd.isInit) {
      if (!explorer.mgmt.isNew) {
        $('#webproperty').unbind('click');
      }

      explorer.mgmt.webpropertyDd.init('webproperty');

      if (explorer.mgmt.clickedId == 'webproperty') {
        explorer.mgmt.webpropertyDd.update(results);
        explorer.mgmt.clickedId = '';
        explorer.mgmt.webpropertyDd.open();
        return;
      }
    }

    explorer.mgmt.webpropertyDd.update(results);
    explorer.mgmt.updateUi('webproperty', results.items[0].name,
        results.items[0].id);

  }
};


/**
 * Queries the Management API for a list of Profiles for the
 * current use, selected account, and selected property.
 */
explorer.mgmt.loadProfiles = function() {

  $('#profile').addClass('small-loader').removeClass('dd-dropInput');

  // Try to retrieve from cache.
  var results = explorer.mgmt.cache[explorer.mgmt.data.webpropertyId];
  if (results) {
    explorer.mgmt.handleProfiles(results);

  } else {
    // Fetch from API.
    gapi.client.analytics.management.profiles.list({
      'accountId': explorer.mgmt.data.accountId,
      'webPropertyId': explorer.mgmt.data.webpropertyId}).execute(
        explorer.mgmt.handleProfiles);
  }

};


/**
 * Handles the response from a query to the Management API for a list of
 * profiles for the current user, selected account, and property.
 * @param {Object} results A Core Reporting API response.
 */
explorer.mgmt.handleProfiles = function(results) {
  $('#profile').removeClass('small-loader');

  if (results.error) {
    explorer.mgmt.displayError(results);

  } else if (!results.items || !results.items.length) {
    $('#profile').val('No views (profiles) found');

  } else {
    $('#profile').addClass('dd-dropInput');
    explorer.mgmt.cache[explorer.mgmt.data.webpropertyId] = results;

    if (!explorer.mgmt.profileDd.isInit) {
      if (!explorer.mgmt.isNew) {
        $('#profile').unbind('click');
      }

      explorer.mgmt.profileDd.init('profile');

      if (explorer.mgmt.clickedId == 'profile') {
        explorer.mgmt.profileDd.update(results);
        explorer.mgmt.clickedId = '';
        explorer.mgmt.profileDd.open();
        return;
      }
    }

    explorer.mgmt.profileDd.update(results);
    explorer.mgmt.updateUi('profile', results.items[0].name, results.items[0].id);
  }
};


/**
 * Updates the Explorer UI based on the currently selected Account, Property,
 * and Profile.
 * @param {String} entityName The entity type that needs updating.
 * @param {String} name The name of the entity.
 * @param {String} id The Id of the entity.
 */
explorer.mgmt.updateUi = function(entityName, name, id) {
  switch (entityName) {
    case 'account':
      explorer.mgmt.data.accountId = id;
      explorer.mgmt.data.accountName = name;
      $('#account').val(explorer.mgmt.data.accountName);
      explorer.mgmt.loadWebproperties();
      break;

    case 'webproperty':
      explorer.mgmt.data.webpropertyId = id;
      explorer.mgmt.data.webpropertyName = name;
      $('#webproperty').val(explorer.mgmt.data.webpropertyName);
      explorer.mgmt.loadProfiles();
      break;

    case 'profile':
      explorer.mgmt.data.profileId = id;
      explorer.mgmt.data.profileName = name;
      $('#profile').val(explorer.mgmt.data.profileName);
      explorer.mgmt.updateIds(explorer.mgmt.data.profileId);
      explorer.mgmt.store(explorer.mgmt.data);
      break;
  }
};


/**
 * Updates the Ids field for the currently selected profile.
 * @param {String} profileId The profile Id.
 */
explorer.mgmt.updateIds = function() {
  $('#ids').val('ga:' + explorer.mgmt.data.profileId).keyup();
};


/**
 * Displays an error message to the user.
 * @param {Object} resultError The error to display.
 */
explorer.mgmt.displayError = function(resultError) {
  var errorMsg = resultError.code + ' : ' + resultError.message;
  explorer.coreapi.displayErrorMessage(errorMsg);
};


/**
 * Stores management data if storage is available.
 * @param {Objet} data JSON data to store.
 */
explorer.mgmt.store = function(data) {
  if (localStorage && JSON) {
    localStorage.setItem(explorer.mgmt.STORAGE_KEY, JSON.stringify(data));
  }
};


/**
 * Load previously stored management data.
 * @param {String} userId The Id of the user.
 * @return {Object} JSON previously stored JSON data.
 */
explorer.mgmt.load = function() {
  if (localStorage && JSON) {
    return JSON.parse(localStorage.getItem(explorer.mgmt.STORAGE_KEY));
  }
};

