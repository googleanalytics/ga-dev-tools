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


import clone from 'lodash-node/modern/lang/clone';
import find from 'lodash-node/modern/collection/find';
import FormControl from './form-control';
import getTagData from './tag-data';
import Model from './model';
import qs from 'querystring';
import QueryResults from './query-results';
import React from 'react';
import store from '../data-store';
import ViewSelector from './view-selector';


let state = new Model();
let params = new Model(getInitalQueryParams());
let settings = new Model(store.get('query-explorer:settings'));


function getInitalQueryParams() {
  let params = {};
  let urlParams = qs.parse(location.search.slice(1));

  if (urlParams['start-date'] &&
      urlParams['end-date'] &&
      urlParams['metrics']) {
    params = urlParams;
  }
  else {
   params = store.get('query-explorer:params');
  }

  if (urlParams.ids) {
    params.ids = urlParams.ids;
  }

  return params;
}


function handleViewSelectorChange(data) {
  params.set('ids', data.ids);
  state.set({
    selectedAccount: data.account.name,
    selectedProperty: data.property.name,
    selectedView: data.view.name
  });
}


function handleSegmentDefinitionToggle() {
  settings.set('useDefinition', !settings.useDefinition);
}


function handleIdsToggle() {
  settings.set('includeIds', !settings.includeIds);
}


function handleFieldChange(e) {
  let {id, value} = e.target
  if (value) {
    params.set(id, value)
  }
  else {
    params.unset(id);
  }
}


function handleDataChartSuccess(data) {
  debugger;
  state.set({
    hasReport: true,
    lastSuccessfulReport: clone(params.get()),
    queryResult: data.response,
    queriedProperty: state.selectedProperty,
    queriedView: state.selectedView,
    isQuerying: false,
    hasQueryError: false
  });
}


function handleDataChartError(err) {
  state.set({
    isQuerying: false,
    hasReport: false,
    lastSuccessfullReport: clone(params.get()),
    hasQueryError: true,
    queryErrorCode: err.error.code,
    queryErrorMessage: err.error.message
  });
}


function handleSubmit(e) {
  e.preventDefault();
  state.set('isQuerying', true);
}


function render(metrics, dimensions, segments) {

  console.log(state.get());

  React.render(
    <div>
      <h3 className="H3--underline">Select a view</h3>
      <ViewSelector ids={params['ids']} onChange={handleViewSelectorChange} />
      <h3 className="H3--underline">Set the query parameters</h3>

      <form onSubmit={handleSubmit}>
        <FormControl
          value={params['ids']}
          name="ids"
          onChange={handleFieldChange}
          placeholder="ga:XXXX"
          required />
        <FormControl
          value={params['start-date']}
          name="start-date"
          onChange={handleFieldChange}
          placeholder="YYYY-MM-DD"
          required />
        <FormControl
          value={params['end-date']}
          name="end-date"
          onChange={handleFieldChange}
          placeholder="YYYY-MM-DD"
          required />
        <FormControl
          name="metrics"
          value={params['metrics']}
          onChange={handleFieldChange}
          tags={metrics}
          required />
        <FormControl
          name="dimensions"
          value={params['dimensions']}
          onChange={handleFieldChange}
          tags={dimensions} />
        <FormControl
          name="sort"
          value={params['sort']}
          onChange={handleFieldChange} />
        <FormControl
          name="filters"
          value={params['filters']}
          onChange={handleFieldChange} />
        <FormControl
          name="segment"
          value={params['segment']}
          onChange={handleFieldChange}
          tags={segments}>
          <label>
            <input
              className="Checkbox"
              type="checkbox"
              onChange={handleSegmentDefinitionToggle}
              checked={settings.useDefinition} />
            Show segment definitions instead of IDs.
          </label>
        </FormControl>
        <FormControl
          name="samplingLevel"
          value={params['samplingLevel']}
          onChange={handleFieldChange} />
        <FormControl
          name="start-index"
          value={params['start-index']}
          onChange={handleFieldChange} />
        <FormControl
          name="max-results"
          value={params['max-results']}
          onChange={handleFieldChange} />

        <div className="FormControl FormControl--inline FormControl--action">
          <div className="FormControl-body">
            <button
              className="Button Button--action"
              disabled={state.isQuerying}>
              {state.isQuerying ?  'Loading...' : 'Run Query'}
            </button>
          </div>
        </div>
      </form>

      <aside className="Error" hidden={!state.hasQueryError}>
        <h3 className="Error-title">
          Ack! There was an error ({state.queryErrorCode})
        </h3>
        <p className="Error-message">{state.queryErrorMessage}</p>
      </aside>

      <QueryResults
        hasReport={state.hasReport}
        result={state.queryResult}
        query={params.get()}
        isQuerying={state.isQuerying}
        property={state.queriedProperty}
        view={state.queriedView}
        includeIds={settings.includeIds}
        onSuccess={handleDataChartSuccess}
        onError={handleDataChartError}
        onIdsToggle={handleIdsToggle} />

    </div>,
    document.getElementById('react-container')
  );
}


/**
 * Initialize all Query Explorer modules.
 */
function setup() {
  getTagData().then(function(data) {

    let metrics = data.metrics;
    let dimensions = data.dimensions;
    let segmentIds = data.segmentIds;
    let segmentDefinitions = data.segmentDefinitions
    let segments = settings.useDefinition ? segmentDefinitions : segmentIds;

    // Update the segments array when the useDefinition settings changes.
    settings.on('change', function() {
      segments = settings.useDefinition ? segmentDefinitions : segmentIds;
      if (params.segment) {
        let value = params.segment;
        let segment = find(segments, segment =>
            value == segment.segmentId || value == segment.definition);
        params.set('segment', (segment && segment.id) || value);
      }
    });

    // Save any changes and rerender.
    settings.on('change', function() {
      store.set('query-explorer:settings', settings.get());
      render(metrics, dimensions, segments);
    });
    params.on('change', function() {
      // TODO(philipwalton): ensure only whitelisted params are saved.
      store.set('query-explorer:params', params.get());
      render(metrics, dimensions, segments);
    });
    state.on('change', function() {
      render(metrics, dimensions, segments);
    });

    // Perform the initial render.
    render(metrics, dimensions, segments);
  });
}


module.exports = {

  /**
   * Run setup if authorized, otherwise add an event to run on auth success.
   */
  init: function() {
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
