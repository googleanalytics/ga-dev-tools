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


/* global $, gapi */


import {gaAll} from './analytics';


export default {

  init: function() {
    this.addOpenHandler();
    this.addSignOutHandler();
  },

  addOpenHandler: function() {
    $(document).on('touchend.header click.header', '#header-user', (event) => {
      event.preventDefault();
      this.open();
    });
  },

  addCloseHandler: function() {
    $(document).on('touchend.header click.header', (event) => {
      // Only close if the user didn't click inside of #header-auth.
      if (!$(event.target).closest('#header-auth').length) {
        event.preventDefault();
        this.close();
      }
    });
  },

  addSignOutHandler: function() {
    $('#header-sign-out').on('click', (event) => {
      gapi.analytics.ready(() => {
        event.preventDefault();
        this.close();
        gapi.analytics.auth.signOut();
      });
    });
  },

  open: function() {
    $(document).off('.header');
    this.addCloseHandler();
    $('#header').addClass('is-open');
    gaAll('send', 'event', 'Header', 'open');
  },

  close: function() {
    $(document).off('.header');
    this.addOpenHandler();
    $('#header').removeClass('is-open');
    gaAll('send', 'event', 'Header', 'close');
  }

};
