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


import HitBuilder from './components/hit-builder';
import React from 'react';


/**
 * The base render function.
 */
function render(props) {
  React.render(
    <HitBuilder {...props} />,
    document.getElementById('react-test')
  );
}


/**
 * The callback invoked when the Embed API has authorized the user.
 * Updates the CSS state classes and rerenders in the authorized state.
 */
function setup() {
  render({isAuthorized: true});

  // Add/remove state classes.
  $('body').removeClass('is-loading');
  $('body').addClass('is-ready');
}


// Run setup when the Embed API is ready and the user is authorized.
gapi.analytics.ready(function() {
  if (gapi.analytics.auth.isAuthorized()) {
    setup();
  }
  else {
    gapi.analytics.auth.once('success', setup);
  }
});


// Perform an initial render.
render();
