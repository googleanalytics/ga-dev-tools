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


// Global polyfills.
require('core-js');
require('svg4everybody');


var accountExplorer = require('./account-explorer');
var analytics = require('./analytics');
var embedApi = require('./embed-api');
var explorer = require('./explorer');
var header = require('./header');
var highlighter = require('./highlighter');
var queryExplorer = require('./query-explorer');
var router = require('router');
var sidebar = require('./sidebar');


// Initiaze the header functionality.
header.init();

// Initiaze the sidebar functionality.
sidebar.init();

// Highlight code blocks.
highlighter.highlight('pre');

// Setup Google Analytics tracking.
analytics.track();

// Add routes to initialize code based on the page the user is on.
router()
    .case('/query-explorer/', queryExplorer.init)
    .case('/explorer/', explorer.init)
    .case('/embed-api/<page>/', embedApi.init)
    .case('/account-explorer/', accountExplorer.init)
    .match();
