// Copyright 2017 Google Inc. All rights reserved.
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
import {render} from 'react-dom';
import {connect, Provider} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from './actions';
import UsageTrends from './components/usage-trends';
import {getStore} from './store';

import site from '../site';


/**
 * See: https://github.com/reactjs/react-redux
 * @param {Object} state
 * @return {Object} The props from the state.
 */
const mapStateToProps = (state) => {
  return state;
};


/**
 * See: https://github.com/reactjs/react-redux
 * @param {function} dispatch
 * @return {Object} The props with dispatch actions.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};


const preloadGoogleChartLibrary = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = 'https://www.gstatic.com/charts/loader.js';
  document.head.appendChild(link);
};


const waitForAuthorization = () => {
  return new Promise((resolve) => {
    gapi.analytics.ready(() => {
      if (gapi.analytics.auth.isAuthorized()) {
        resolve();
      } else {
        gapi.analytics.auth.once('success', () => resolve());
      }
    });
  });
};


const main = () => {
  Promise.all([
    getStore(),
    waitForAuthorization(),
  ]).then(([store]) => {
    site.setReadyState();
    store.dispatch(actions.updateAuth({isSignedIn: true}));

    const UsageTrendsApp =
        connect(mapStateToProps, mapDispatchToProps)(UsageTrends);

    const renderApp = (() => {
      const container = document.querySelector('#usage-trends');
      return () => {
        render(
            <Provider store={store}>
              <UsageTrendsApp />
            </Provider>,
            container);
      };
    })();

    preloadGoogleChartLibrary();

    // Perform an initial render.
    store.subscribe(renderApp);
    renderApp();
  })
      .catch((err) => {
    import('../analytics.js').then((analytics) => {
      analytics.trackError(err);
    });
      });
};


main();
