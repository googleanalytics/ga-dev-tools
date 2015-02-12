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


var dataStore = require('../data-store');

/**
 * To fit the style of the page, customize the view selector template.
 */
var VIEW_SELECTOR_TEMPLATE =
    '<div class="FormControl">' +
    '  <label class="FormControl-label">Account</label>' +
    '  <div class="FormControl-body">' +
    '    <select class="FormField"></select>' +
    '  </div>' +
    '</div>' +
    '<div class="FormControl">' +
    '  <label class="FormControl-label">Property</label>' +
    '  <div class="FormControl-body">' +
    '    <select class="FormField"></select>' +
    '  </div>' +
    '</div>' +
    '<div class="FormControl">' +
    '  <label class="FormControl-label">View</label>' +
    '  <div class="FormControl-body">' +
    '    <select class="FormField"></select>' +
    '  </div>' +
    '</div>';


module.exports = {

  /**
   * Initialize the view selector and attach events to watch for changes
   * to sync the `ids` field value to the view selector's chosen view.
   */
  init: function() {

    var data = dataStore.get('query-explorer');
    var ids = data && data.ids;

    var viewSelector = new gapi.analytics.ext.ViewSelector2({
      container: 'view-selector-container',
      ids: ids,
      template: VIEW_SELECTOR_TEMPLATE
    }).execute();

    viewSelector.on('change', function(ids) {
      $('#ids').val(ids).trigger('change');
    });

    // TODO(philipwalton): Add an error message to the user that
    // they don't have access to the selected view.
    viewSelector.on('error', $.noop);

    $('#ids').on('change', function() {
      viewSelector.set({ids: $(this).val()}).execute();
    });
  }
};
