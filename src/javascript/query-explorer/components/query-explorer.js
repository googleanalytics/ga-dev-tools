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


/* global $, ga, gapi */


import assign from 'lodash/object/assign';
import clone from 'lodash/lang/clone';
import Datepicker from './datepicker';
import filter from 'lodash/collection/filter';
import find from 'lodash/collection/find';
import HelpIconLink from './help-icon-link';
import map from 'lodash/collection/map';
import mapValues from 'lodash/object/mapValues';
import Model from '../../model';
import pick from 'lodash/object/pick';
import qs from 'querystring';
import queryParams from '../query-params';
import QueryReport from './query-report';
import React from 'react';
import ReactDOM from 'react-dom';
import SearchSuggest from '../../components/search-suggest';
import Select2MultiSuggest from './select2-multi-suggest';
import store from '../../data-store';
import tagData from '../tag-data';
import ViewSelector from './view-selector';


/**
 * The parameters that are safe to track the values entered by users.
 * All other params are either uninteresting or may possibly contain PII and
 * therefore only their presence/absense is tracked.
 */
const PARAMS_TO_TRACK = ['start-date', 'end-date', 'metrics', 'dimensions'];


/**
 * Store a reference here for access to the whole module.
 */
// let metrics;
// let dimensions;
// let segments;
// let sortOptions;


/**
 * Create model instances to store render state.
 */
// let state = new Model();
// let params = new Model(getInitalQueryParams());
// let settings = new Model(store.get('query-explorer:settings'));


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

    // Remove the query params in the URL to prevent losing state on refresh.
    // https://github.com/googleanalytics/ga-dev-tools/issues/61
    if (history && history.replaceState) {
      history.replaceState(history.state, document.title, location.pathname);
    }

    urlParams = queryParams.sanitize(assign({}, defaultParams, urlParams));
    store.set('query-explorer:params', urlParams);
    return urlParams;
  }
  else if (storedParams) {
    return queryParams.sanitize(assign({}, defaultParams, storedParams));
  }
  else {
    return defaultParams;
  }
}


export default class QueryExplorer extends React.Component {

  state = {
    isAuthorized: false
  };

  constructor(props) {
    super(props);

    this.metrics;
    this.dimensions;
    this.segments;
    this.sortOptions;

    this._state = new Model();
    this.params = new Model(getInitalQueryParams());
    this.settings = new Model(store.get('query-explorer:settings'));

    // Store the initial settings on the tracker.
    ga('set', 'dimension3', qs.stringify(this.settings.get()));
  }


  /**
   * Invoked when a user changes the ViewSelector2 instance.
   * @param {Object} data The object emited by the ViewSelector2's "changeView"
   * event.
   */
  handleViewSelectorChange = async (viewSelectorData) => {

    let {account, property, view} = viewSelectorData;

    this.params.set('ids', viewSelectorData.ids);
    this._state.set('selectedAccountData', clone(viewSelectorData));

    let result = await tagData.getMetricsAndDimensions(account, property, view);

    this.metrics = result.metrics;
    this.dimensions = result.dimensions;

    // TODO(philipwalton) This does need to happen after metrics and dimensions
    // potentially change, but it sould probably happen in an event handler
    // rather than here. Refactor once dimensions and metrics are moved to
    // be properties of `state`.
    this.setSortOptions();

    // TODO(philipwalton): see if this can be done without using forceUpdate.
    this.forceUpdate();
  }


  /**
   * Invoked when a user changes any of the <QueryForm> fields.
   * @param {Event|Object} e A native Event object, React event, or data object
   *     containing the target.name and target.value properties.
   */
  handleFieldChange = (e) => {
    let {name, value} = e.target;
    if (value) {
      this.params.set(name, value);
    }
    else {
      this.params.unset(name);
    }

    // TODO(philipwalton): see if this can be done without using forceUpdate.
    this.forceUpdate();
  }


  /**
   * Sets or updates the options for the sort field based on the chosen
   * metrics and dimensions.
   */
  setSortOptions() {

    let metsAndDims = (this.metrics || []).concat(this.dimensions || []);
    let chosenMetrics = (this.params.get('metrics') || '').split(',');
    let chosenDimensions = (this.params.get('dimensions') || '').split(',');
    let chosenMetsAndDims = (chosenMetrics || []).concat(chosenDimensions || []);

    this.sortOptions = [];

    for (let choice of chosenMetsAndDims) {
      for (let option of metsAndDims) {
        if (choice == option.id) {

          let descending = clone(option);
          descending.name += ' (descending)';
          descending.text += ' (descending)';
          descending.id = '-' + choice;

          let ascending = clone(option);
          ascending.name += ' (ascending)';
          ascending.text += ' (ascending)';
          ascending.id = choice;

          this.sortOptions.push(descending);
          this.sortOptions.push(ascending);
        }
      }
    }
  }


  async handleUserAuthorized() {
    this.segments = await tagData.getSegments(this.settings.get('useDefinition'));
    this.forceUpdate();

    // Listen for changes and rerender.
    this.settings.on('change', () => {
      store.set('query-explorer:settings', this.settings.get());
      ga('set', 'dimension3', qs.stringify(this.settings.get()));
      this.forceUpdate();
    });
    this.params.on('change', (model) => {
      if ('metrics' in model.changedProps ||
          'dimensions' in model.changedProps) {
        this.setSortOptions();
      }
      store.set('query-explorer:params', queryParams.sanitize(this.params.get()));
      this.forceUpdate();
    });
    this._state.on('change', () => {
      this.forceUpdate();
    });
  }


  /**
   * Invoked when a user clicks on the segment definition checkbox.
   * @param {SyntheticEvent} e The React event.
   */
  handleSegmentDefinitionToggle = (e) => {
    let useDefinition = e.target.checked;
    this.settings.set('useDefinition', useDefinition);

    tagData.getSegments(useDefinition).then((results) => {
      this.segments = results;
      // TODO(philipwalton): don't use forceUpdate().
      this.forceUpdate();
    });

    if (this.params.get('segment')) {
      let value = this.params.get('segment');
      let segment = find(this.segments, segment =>
          value == segment.segmentId || value == segment.definition);

      if (segment) {
        this.params.set('segment', useDefinition ?
            segment.definition : segment.segmentId);
      }
    }
  }



  /**
   * Invoked when a user clicks on the include `ids` checkbox.
   * @param {SyntheticEvent} e The React event.
   */
  handleIdsToggle = (e) => {
    this.settings.set('includeIds', e.target.checked);
  }


  /**
   * Invoked when a user clicks on the include `access_token` checkbox.
   * @param {SyntheticEvent} e The React event.
   */
  handleAccessTokenToggle = (e) => {
    this.settings.set('includeAccessToken', e.target.checked);
  }


  /**
   * Invoked when the DataChart component's "success" event emits.
   * @param {Object} data The object emitted by the DataChart's "success" event.
   */
  handleDataChartSuccess = (data) => {
    this._state.set({
      isQuerying: false,
      report: {
        accountData: clone(this._state.get('selectedAccountData')),
        params: this._state.get('report').params,
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
  handleDataChartError = (err) => {
    this._state.set({
      isQuerying: false,
      report: {
        accountData: clone(this._state.get('selectedAccountData')),
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
  handleSubmit = (e) => {
    e.preventDefault();

    let paramsClone = clone(this.params.get());

    let trackableParamData = map(paramsClone, (value, key) => {
      // Don't run `encodeURIComponent` on these params because the they will
      // never contain characters that make parsing fail (or be ambiguous).
      // NOTE: Manual serializing is requred until the encodeURIComponent override
      // is supported here: https://github.com/Gozala/querystring/issues/6
      return PARAMS_TO_TRACK.includes(key) ? `${key}=${value}` : key;
    }).join('&');

    // Set it on the tracker so it gets sent with all Query Explorer hits.
    ga('set', 'dimension2', trackableParamData);

    this._state.set({
      isQuerying: true,
      report: {
        params: paramsClone
      }
    });
  }


  /**
   * Invoked when a user focuses on the "Direct link to this report" textarea.
   */
  handleDirectLinkFocus(e) {
    ga('send', 'event', 'query direct link', 'focus');
  }


  /**
   * Invoked when a user focuses on the "API Query URI" textarea.
   */
  handleApiUriFocus() {
    ga('send', 'event', 'query api uri', 'focus');
  }


  /**
   * Invoked when a user clicks the "Download Results as TSV" button.
   */
  handleDownloadTsvClick() {
    ga('send', 'event', 'query tsv download', 'click');
  }





  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthorized && !this.state.isAuthorized) {
      this.handleUserAuthorized();
    }
  }

  render() {

    let {actions, params} = this.props;

    return (
      <div>
        <h3 className="H3--underline">Select a view</h3>

        <ViewSelector
          ids={this.params.get('ids')}
          onChange={this.handleViewSelectorChange} />

        <h3 className="H3--underline">Set the query parameters</h3>

        <form onSubmit={this.handleSubmit}>

          <div className="FormControl FormControl--inline FormControl--required">
            <label className="FormControl-label">ids</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="ids"
                  value={this.params.get('ids')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="ids" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline FormControl--required">
            <label className="FormControl-label">start-date</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Datepicker
                  name="start-date"
                  value={this.params.get('start-date')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="start-date" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline FormControl--required">
            <label className="FormControl-label">end-date</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Datepicker
                  name="end-date"
                  value={this.params.get('end-date')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="end-date" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline FormControl--required">
            <label className="FormControl-label">metrics</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="metrics"
                  value={this.params.get('metrics')}
                  tags={this.metrics}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="metrics" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">dimensions</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="dimensions"
                  value={this.params.get('dimensions')}
                  tags={this.dimensions}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="dimensions" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">sort</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="sort"
                  value={this.params.get('sort')}
                  tags={this.sortOptions}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="sort" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">filters</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="filters"
                  value={this.params.get('filters')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="filters" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">segment</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <SearchSuggest
                  name="segment"
                  value={this.params.get('segment')}
                  options={this.segments}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="segment" />
              </div>
              <div className="FormControl-info">
                <label>
                  <input
                    className="Checkbox"
                    type="checkbox"
                    onChange={this.handleSegmentDefinitionToggle}
                    checked={this.settings.get('useDefinition')} />
                  Show segment definitions instead of IDs.
                </label>
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">samplingLevel</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="samplingLevel"
                  value={this.params.get('samplingLevel')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="samplingLevel" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">start-index</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="start-index"
                  value={this.params.get('start-index')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="start-index" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">max-results</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="max-results"
                  value={this.params.get('max-results')}
                  onChange={this.handleFieldChange} />
                <HelpIconLink name="max-results" />
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline FormControl--action">
            <div className="FormControl-body">
              <button
                className="Button Button--action"
                disabled={this._state.get('isQuerying')}>
                {this._state.get('isQuerying') ? 'Loading...' : 'Run Query'}
              </button>
            </div>
          </div>

        </form>

        <QueryReport
          report={this._state.get('report')}
          isQuerying={this._state.get('isQuerying')}
          includeIds={this.settings.get('includeIds')}
          includeAccessToken={this.settings.get('includeAccessToken')}
          onSuccess={this.handleDataChartSuccess}
          onError={this.handleDataChartError}
          onIdsToggle={this.handleIdsToggle}
          onAccessTokenToggle={this.handleAccessTokenToggle}
          onDirectLinkFocus={this.handleDirectLinkFocus}
          onApiUriFocus={this.handleApiUriFocus}
          onDownloadTsvClick={this.handleDownloadTsvClick} />

      </div>
    );
  }

}

