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


import accountSummaries from 'javascript-api-utils/lib/account-summaries';
import HitValidator from './components/hit-validator';
import React from 'react';


function render(properties) {
  React.render(
    <HitValidator properties={properties} />,
    document.getElementById('react-test')
  );
}


function setup() {
  accountSummaries.get().then(function(summaries) {
    let properties = summaries.allProperties().map((property) => {
      return {
        name: property.name,
        id: property.id,
        group: summaries.getAccountByPropertyId(property.id).name
      }
    })

    render(properties);
  });

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
