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


/* global gapi */


import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from './actions';
import QueryExplorer from './components/query-explorer';
import store from './store';

import site from '../site';


/**
 * See: https://github.com/reactjs/react-redux
 * @param {Object} state
 * @return {Object} The props from the state.
 */
function mapStateToProps(state) {
  return state;
}


/**
 * See: https://github.com/reactjs/react-redux
 * @param {function} dispatch
 * @return {Object} The props with dispatch actions.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}


let QueryExplorerApp =
    connect(mapStateToProps, mapDispatchToProps)(QueryExplorer);


/**
 * The base render function.
 */
function render() {
  ReactDOM.render(
    <Provider store={store}>
      <QueryExplorerApp />
    </Provider>,
    document.getElementById('query-explorer')
  );
}


/**
 * The callback invoked when the Embed API has authorized the user.
 * Updates the CSS state classes and rerenders in the authorized state.
 */
function onAuthorizationSuccess() {
  store.dispatch(actions.handleAuthorizationSuccess());
  site.setReadyState();
}


gapi.analytics.ready(function() {
  if (gapi.analytics.auth.isAuthorized()) {
    onAuthorizationSuccess();
  } else {
    gapi.analytics.auth.once('success', onAuthorizationSuccess);
  }
});


// Perform an initial render.
store.subscribe(render);
render();
