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


/* global $ */


export default {

  init: function() {
    this.addOpenHandler();
  },

  addOpenHandler: function() {
    $(document).on('touchend.header click.header',
        '#header-user', function(event) {

      event.preventDefault();
      $(document).off('.header');
      this.open();
      this.addCloseHandler();
    }.bind(this));
  },

  addCloseHandler: function() {
    $(document).on('touchend.header click.header', function(event) {

      // Only close if the user didn't click inside of #header-auth.
      if (!$(event.target).closest('#header-auth').length) {
        event.preventDefault();
        $(document).off('.header');
        this.close();
        this.addOpenHandler();
      }
    }.bind(this));
  },

  open: function() {
    $('#header').addClass('is-open');
  },

  close: function() {
    $('#header').removeClass('is-open');
  }

};
