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


import assign from 'lodash/object/assign';
import clone from 'lodash/lang/clone';
import find from 'lodash/collection/find';
import getTagData from './tag-data';
import mapValues from 'lodash/object/mapValues';
import Model from '../model';
import qs from 'querystring';
import QueryForm from './query-form';
import queryParams from './query-params';
import QueryReport from './query-report';
import React from 'react';
import store from '../data-store';
import ViewSelector from './view-selector';


/**
 * Store a reference here for access to the whole module.
 */
let metrics;
let dimensions;
let segments;


/**
 * Create model instances to store render state.
 */
let state = new Model();
let params = new Model(getInitalQueryParams());
let settings = new Model(store.get('query-explorer:settings'));


/**
 * Gets the query params used to populate the params model.
 * If params are found in the URL, they are used and merged with the defaults.
 * Otherwise the datastore is checked for params from a previous session, and
 * those are merged with the defaults.
 * If no params exist in the URL or the datastore, the defaults are returned.
 * @return {Object} The initial params.
 */
function getInitalQueryParams() {
  let defaultParams = {'start-date': '30daysAgo', 'end-date': 'yesterday'};
  let storedParams = store.get('query-explorer:params');
  let urlParams = qs.parse(location.search.slice(1));

  // Don't assume that the presence any query params means it's a Query
  // Explorer URL. Only use the query params if they exist and contain at least
  // a metric value.
  if (urlParams && urlParams['metrics']) {

    // Some of the Query Explorer links out in the wild have double-encoded
    // URL params. Check for the substring '%253A' (a colon, double-encoded),
    // and if found then double-decode all params.
    if (urlParams['metrics'].indexOf('%253A')) {
      urlParams = mapValues(urlParams, (value) => decodeURIComponent(value));
    }

    return assign({}, defaultParams, urlParams);
  }
  else if (storedParams) {
    return assign({}, defaultParams, storedParams);
  }
  else {
    return defaultParams;
  }
}


/**
 * Invoked when a user changes the ViewSelector2 instance.
 * @param {Object} data The object emited by the ViewSelector2's "changeView"
 * event.
 */
function handleViewSelectorChange(data) {
  params.set('ids', data.ids);
  state.set('selectedAccountData', clone(data));
}


/**
 * Invoked when a user clicks on the segment definition checkbox.
 * @param {SyntheticEvent} e The React event.
 */
function handleSegmentDefinitionToggle(e) {
  settings.set('useDefinition', e.target.checked);
}


/**
 * Invoked when a user clicks on the include `ids` checkbox.
 * @param {SyntheticEvent} e The React event.
 */
function handleIdsToggle(e) {
  settings.set('includeIds', e.target.checked);
}


/**
 * Invoked when a user clicks on the include `access_token` checkbox.
 * @param {SyntheticEvent} e The React event.
 */
function handleAccessTokenToggle(e) {
  settings.set('includeAccessToken', e.target.checked);
}


/**
 * Invoked when a user changes any of the <QueryForm> fields.
 * @param {Event|Object} e The native or React event.
 */
function handleFieldChange(e) {
  let {name, value} = e.target;
  if (value) {
    params.set(name, value);
  }
  else {
    params.unset(name);
  }
}


/**
 * Invoked when the DataChart component's "success" event emits.
 * @param {Object} data The object emitted by the DataChart's "success" event.
 */
function handleDataChartSuccess(data) {
  state.set({
    isQuerying: false,
    report: {
      accountData: clone(state.get('selectedAccountData')),
      params: state.get('report').params,
      response: data.response
    }
  });
}


/**
 * Invoked when the DataChart component's "error" event emits.
 * @param {Object} data The error emitted by the DataChart's "error" event.
 */
function handleDataChartError(err) {
  state.set({
    isQuerying: false,
    report: {
      accountData: clone(state.get('selectedAccountData')),
      params: state.get('report').params,
      error: err.error
    }
  });
}


/**
 * Invoked when a user submits the <QueryForm>.
 * @param {Event|Object} e The native or React event.
 */
function handleSubmit(e) {
  e.preventDefault();
  state.set({
    isQuerying: true,
    report: {
      params: clone(params.get())
    }
  });
}


/**
 * Render the Query Explorer.
 */
function render() {

  React.render(
    <div>
      <h3 className="H3--underline">Select a view</h3>

      <ViewSelector
        ids={params.get('ids')}
        onChange={handleViewSelectorChange} />

      <h3 className="H3--underline">Set the query parameters</h3>

      <QueryForm
        onSubmit={handleSubmit}
        onChange={handleFieldChange}
        onSegmentDefinitionToggle={handleSegmentDefinitionToggle}
        params={params.get()}
        isQuerying={state.get('isQuerying')}
        useDefinition={state.get('useDefinition')}
        metrics={metrics}
        dimensions={dimensions}
        segments={segments} />

      <QueryReport
        report={state.get('report')}
        isQuerying={state.get('isQuerying')}
        includeIds={settings.get('includeIds')}
        includeAccessToken={settings.get('includeAccessToken')}
        onSuccess={handleDataChartSuccess}
        onError={handleDataChartError}
        onIdsToggle={handleIdsToggle}
        onAccessTokenToggle={handleAccessTokenToggle} />

    </div>,
    document.getElementById('react-container')
  );
}


/**
 * Get all form data for the <QueryForm> then setup the form, update the global
 * state classes, and call `render()` when ready.
 */
function setup() {
  getTagData().then(function(data) {

    metrics = data.metrics;
    dimensions = data.dimensions;
    segments = settings.get('useDefinition') ?
        data.segmentDefinitions : data.segmentIds;

    // Update the segments array when the useDefinition settings changes.
    settings.on('change', function() {
      segments = settings.get('useDefinition') ?
          data.segmentDefinitions : data.segmentIds;

      if (params.get('segment')) {
        let value = params.get('segment');
        let segment = find(segments, segment =>
            value == segment.segmentId || value == segment.definition);
        params.set('segment', (segment && segment.id) || value);
      }
    });

    // Listen for changes and rerender.
    settings.on('change', function() {
      store.set('query-explorer:settings', settings.get());
      render();
    });
    params.on('change', function() {
      store.set('query-explorer:params', queryParams.sanitize(params.get()));
      render();
    });
    state.on('change', function() {
      render();
    });

    // Add/remove state classes.
    $('body').removeClass('is-loading');
    $('body').addClass('is-ready');

    // Force render now that select2 tags are available.
    render();
  });
}


export default {

  /**
   * Perform an inital render and run `setup()` once authorized.
   */
  init: function() {

    // Perform an initial render.
    render();

    gapi.analytics.ready(function() {
      if (gapi.analytics.auth.isAuthorized()) {
        setup();
      }
      else {
        gapi.analytics.auth.once('success', setup);
      }
    });
  }
};
