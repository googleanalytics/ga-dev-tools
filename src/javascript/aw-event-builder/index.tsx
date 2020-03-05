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
import { Provider } from "react-redux";

import EventBuilder from "./components";
import store from "./store";
import actions from "./actions";

import site from "../site";

/**
 * The base render function.
 */
function render() {
  ReactDOM.render(
    <Provider store={store}>
      <EventBuilder />
    </Provider>,
    document.getElementById("aw-event-builder")
  );
}

/**
 * The callback invoked when the Embed API has authorized the user.
 * Updates the CSS state classes and rerenders in the authorized state.
 */
function onAuthorizationSuccess() {
  store.dispatch(actions.handleAuthorizationSuccess);
  site.setReadyState();
}

gapi.analytics.ready(function() {
  if (gapi.analytics.auth.isAuthorized()) {
    onAuthorizationSuccess();
  } else {
    gapi.analytics.auth.once("success", onAuthorizationSuccess);
  }
});

render();
