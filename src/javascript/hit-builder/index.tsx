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

import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import HitBuilder from "./components/hit-builder";
import store, { thunkActions } from "./store";
import { actions } from "./store";
import { HitAction, State } from "./types";

import site from "../site";

/**
 * Maps Redux state to component props
 */
const mapStateToProps = (state: State) => {
  return state;
};

const HitBuilderApp = connect(mapStateToProps)(HitBuilder);

/**
 * The base render function.
 */
function render() {
  ReactDOM.render(
    <Provider store={store}>
      <HitBuilderApp />
    </Provider>,
    document.getElementById("hit-builder")
  );
}

/**
 * The callback invoked when the Embed API has authorized the user.
 * Updates the CSS state classes and rerenders in the authorized state.
 */
function onAuthorizationSuccess() {
  // I'm pretty sure this works, but I'm not sure how to type it.
  // I think it's doing redux thunk stuff, so the thunk middleware takes care of
  // this.'
  store.dispatch(thunkActions.handleAuthorizationSuccess);
  site.setReadyState();
}

gapi.analytics.ready(function() {
  if (gapi.analytics.auth.isAuthorized()) {
    onAuthorizationSuccess();
  } else {
    gapi.analytics.auth.once("success", onAuthorizationSuccess);
  }
});

// Perform an initial render.
store.subscribe(render);
render();
