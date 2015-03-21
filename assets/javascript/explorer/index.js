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
import Model from '../model';
import qs from 'querystring';
import QueryForm from './query-form';
import QueryReport from './query-report';
import React from 'react';
import store from '../data-store';
import ViewSelector from './view-selector';


let state = new Model();
let params = new Model(getInitalQueryParams());
let settings = new Model(store.get('query-explorer:settings'));


function getInitalQueryParams() {
  let defaultParams = {'start-date': '30daysAgo', 'end-date': 'yesterday'};
  let storedParams = store.get('query-explorer:params');
  let urlParams = qs.parse(location.search.slice(1));

  if (urlParams &&
      urlParams['start-date'] &&
      urlParams['end-date'] &&
      urlParams['metrics']) {
    return assign({}, defaultParams, urlParams);
  }
  else if (storedParams) {
    return assign({}, defaultParams, storedParams);
  }
  else {
    return defaultParams;
  }
}


function handleViewSelectorChange(data) {
  params.set('ids', data.ids);
  state.set('selectedAccountData', clone(data));
}


function handleSegmentDefinitionToggle() {
  settings.set('useDefinition', !settings.get('useDefinition'));
}


function handleIdsToggle() {
  settings.set('includeIds', !settings.get('includeIds'));
}


function handleAccessTokenToggle() {
  settings.set('includeAccessToken', !settings.get('includeAccessToken'));
}


function handleFieldChange(e) {
  let {name, value} = e.target;
  if (value) {
    params.set(name, value);
  }
  else {
    params.unset(name);
  }
}


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


function handleSubmit(e) {
  e.preventDefault();
  state.set({
    isQuerying: true,
    report: {
      params: clone(params.get())
    }
  });
}


function render(metrics, dimensions, segments) {

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
 * Initialize all Query Explorer modules.
 */
function setup() {
  getTagData().then(function(data) {

    let metrics = data.metrics;
    let dimensions = data.dimensions;
    let segmentIds = data.segmentIds;
    let segmentDefinitions = data.segmentDefinitions
    let segments = settings.get('useDefinition') ?
        segmentDefinitions : segmentIds;

    // Update the segments array when the useDefinition settings changes.
    settings.on('change', function() {
      segments = settings.get('useDefinition') ?
          segmentDefinitions : segmentIds;

      if (params.get('segment')) {
        let value = params.get('segment');
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
