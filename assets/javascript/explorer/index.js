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

var jQuery = require('jquery');

module.exports = {
  init: function() {
    // The legacy query explorer code requires jQuery to be global.
    window.jQuery = window.$ = jQuery;

    // The `explorer` variable isn't defined on the page yet, so we have to wait.
    // Yeah, this isn't ideal.
    // TODO(philipwalton): refactor legacy query explorer JS to use modules.
    jQuery(function() {
      explorer.selfUrl = location.protocol + '//' + location.host + location.pathname;
      explorer.run();
    });
  }
};
