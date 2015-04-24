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


/* global ga, gapi */


import assign from 'lodash/object/assign';
import clone from 'lodash/lang/clone';
import find from 'lodash/collection/find';
import tagData from './tag-data';
import map from 'lodash/collection/map';
import mapValues from 'lodash/object/mapValues';
import Model from '../model';
import pick from 'lodash/object/pick';
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
let sortOptions;


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
  let {account, property, view} = data;

  params.set('ids', data.ids);
  state.set('selectedAccountData', clone(data));

  tagData.getMetricsAndDimensions(
      account, property, view).then(function(data) {
    metrics = data.metrics;
    dimensions = data.dimensions;

    // TODO(philipwalton) This does need to happen after metrics and dimensions
    // potentially change, but it sould probably happen in an event handler
    // rather than here. Refactor once dimensions and metrics are moved to
    // be properties of `state`.
    setSortOptions();

    render();
  });
}


/**
 * Invoked when a user clicks on the segment definition checkbox.
 * @param {SyntheticEvent} e The React event.
 */
function handleSegmentDefinitionToggle(e) {
  let useDefinition = e.target.checked
  settings.set('useDefinition', useDefinition);

  tagData.getSegments(useDefinition).then(function(results) {
    segments = results;
    render();
  });

  if (params.get('segment')) {
    let value = params.get('segment');
    let segment = find(segments, segment =>
        value == segment.segmentId || value == segment.definition);

    if (segment) params.set('segment', useDefinition ?
        segment.definition : segment.segmentId);
  }

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
 * @param {Event|Object} e A native Event object, React event, or data object
 *     containing the target.name and target.value properties.
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
 * Sets or updates the options for the sort field based on the chosen
 * metrics and dimensions.
 */
function setSortOptions() {

  let metsAndDims = (metrics || []).concat(dimensions || []);
  let chosenMetrics = params.get('metrics') &&
      params.get('metrics').split(',');
  let chosenDimensions = params.get('dimensions') &&
      params.get('dimensions').split(',');
  let choices = (chosenMetrics || []).concat(chosenDimensions || []);

  sortOptions = [];

  for (let choice of choices) {
    for (let option of metsAndDims) {
      if (choice.replace(/\d{1,2}/, 'XX').toLowerCase() ==
          option.id.replace(/\d{1,2}/, 'XX').toLowerCase()) {

        let ascending = clone(option);
        let descending = clone(option);
        descending.name += ' (descending)';
        descending.id = '-' + choice;
        ascending.name += ' (ascending)';
        ascending.id = choice;

        sortOptions.push(descending);
        sortOptions.push(ascending);
      }
    }
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

  ga('send', {
    hitType: 'event',
    eventCategory: 'query',
    eventAction: 'submit',
    eventLabel: '(200) OK',
    metric1: 1
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

  ga('send', {
    hitType: 'event',
    eventCategory: 'query',
    eventAction: 'submit',
    eventLabel: `(${err.error.code}) ${err.error.message}`,
    metric2: 1
  });
}


/**
 * Invoked when a user submits the <QueryForm>.
 * @param {Event|Object} e The native or React event.
 */
function handleSubmit(e) {
  e.preventDefault();

  let paramsClone = clone(params.get());

  // Construct a "Query Parameter" dimension string based off this report
  let paramsToTrack = pick(paramsClone,
      ['start-date', 'end-date', 'metrics', 'dimensions']);
  // Don't run `encodeURIComponent` on these params because the they will
  // never contain characters that make parsing fail (or be ambiguous).
  // NOTE: Manual serializing is requred until the encodeURIComponent override
  // is supported here: https://github.com/Gozala/querystring/issues/6
  let serializedParamsToTrack = map(paramsToTrack,
      (value, key) => `${key}=${value}`).join('&');

  // Set it on the tracker so it gets sent with all Query Explorer hits.
  ga('set', 'dimension2', serializedParamsToTrack);

  state.set({
    isQuerying: true,
    report: {
      params: paramsClone
    }
  });
}


/**
 * Invoked when a user focuses on the "Direct link to this report" textarea.
 */
function handleDirectLinkFocus(e) {
  ga('send', 'event', 'query direct link', 'focus');
}


/**
 * Invoked when a user focuses on the "API Query URI" textarea.
 */
function handleApiUriFocus() {
  ga('send', 'event', 'query api uri', 'focus');
}


/**
 * Invoked when a user clicks the "Download Results as TSV" button.
 */
function handleDownloadTsvClick() {
  ga('send', 'event', 'query tsv download', 'click');
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
        useDefinition={settings.get('useDefinition')}
        metrics={metrics}
        dimensions={dimensions}
        segments={segments}
        sortOptions={sortOptions} />

      <QueryReport
        report={state.get('report')}
        isQuerying={state.get('isQuerying')}
        includeIds={settings.get('includeIds')}
        includeAccessToken={settings.get('includeAccessToken')}
        onSuccess={handleDataChartSuccess}
        onError={handleDataChartError}
        onIdsToggle={handleIdsToggle}
        onAccessTokenToggle={handleAccessTokenToggle}
        onDirectLinkFocus={handleDirectLinkFocus}
        onApiUriFocus={handleApiUriFocus}
        onDownloadTsvClick={handleDownloadTsvClick} />

    </div>,
    document.getElementById('react-container')
  );
}


/**
 * Get all form data for the <QueryForm> then setup the form, update the global
 * state classes, and call `render()` when ready.
 */
function setup() {

  tagData.getSegments(settings.get('useDefinition')).then(function(results) {
    segments = results;
    render();
  });

  // Listen for changes and rerender.
  settings.on('change', function() {
    store.set('query-explorer:settings', settings.get());
    ga('set', 'dimension3', qs.stringify(settings.get()));
    render();
  });
  params.on ('change', function(model) {
    if ('dimensions' in model.changedProps ||
        'metrics' in model.changedProps) {
      setSortOptions();
    }
    store.set('query-explorer:params', queryParams.sanitize(params.get()));
    render();
  });
  state.on('change', function() {
    render();
  });

  // Store the initial settings on the tracker.
  ga('set', 'dimension3', qs.stringify(settings.get()));

  // Add/remove state classes.
  $('body').removeClass('is-loading');
  $('body').addClass('is-ready');

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
