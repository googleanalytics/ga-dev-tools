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


// Commmon namespace.
var explorer = explorer || {};


/**
 * Runs the main application. This starts by requesting the latest column data
 * from the Metadata API, which will be used to populate the dimensions and
 * metrics dropdowns and help content. The run callback function name is passed
 * as parameter so that it is called to init the rest of the application.
 */
explorer.run = function() {
  explorer.getMetadata('explorer.runCallback');
};


/**
 * Runs the main application. This starts by taking the Metadata API response,
 * building the dimensions and metrics content and then loading the appropriate
 * libraries. Once complete, the app is initialized.
 *
 * @param {Object} response The response from the Metadata API.
 */
explorer.runCallback = function(response) {
  explorer.metadata.build(response);
  explorer.coreapi.init();
  explorer.mgmt.init();
  explorer.auth.init();
  explorer.loader.loadLibs();
};

