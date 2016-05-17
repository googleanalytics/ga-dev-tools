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


import React from 'react';
import accountSummaries from 'javascript-api-utils/lib/account-summaries';

import Datepicker from './datepicker';
import HelpIconLink from './help-icon-link';
import RequestViewer from './request-viewer';
import QueryReport from './query-report';
import Select2MultiSuggest from './select2-multi-suggest';
import ViewSelector from './view-selector';
import BarChartComponent from './bar-chart';

import {ga} from '../../analytics';
import AlertDispatcher from '../../components/alert-dispatcher';
import SearchSuggest from '../../components/search-suggest';


/**
 * The parameters that are safe to track the values entered by users.
 * All other params are either uninteresting or may possibly contain PII and
 * therefore only their presence/absense is tracked.
 */
const PARAMS_TO_TRACK = ['startDate', 'endDate', 'metrics', 'dimensions'];


export default class RequestComposer extends React.Component {

  /**
   * Invoked when a user changes the ViewSelector2 instance.
   * @param {Object} viewData The object emited by the ViewSelector2's
   * `changeView` event.
   */
  handleViewSelectorChange = (viewData) => {
    let {actions} = this.props;
    let {viewId} = viewData;
    console.log('ViewSelectorChange' + viewData);
    actions.updateParams({viewId});
    actions.updateMetricsDimensionsAndSortOptions(viewData);
  }


  /**
   * Invoked when a user changes any of the <QueryForm> fields.
   * @param {Event|Object} e A native Event object, React event, or data object
   *     containing the target.name and target.value properties.
   */
  handleParamChange = ({target: {name, value}}) => {
    this.props.actions.updateParams({[name]: value});

    if (name == 'metrics' || name == 'dimensions') {
      this.props.actions.updateSortOptions();
    }
  }


  /**
   * Invoked when a user clicks on the segment definition checkbox.
   * @param {{target: Element}} The React event.
   */
  handleSegmentDefinitionToggle = ({target: {checked: useDefinition}}) => {
    let {actions} = this.props;
    let {segment} = this.props.params;

    actions.updateSettings({useDefinition});
    actions.updateSegmentsOptions(useDefinition);

    if (segment) {
      actions.swapSegmentIdAndDefinition(segment, useDefinition);
    }
  }



  /**
   * Invoked when a user submits the <QueryForm>.
   * @param {Event|Object} e The native or React event.
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    let {actions, params} = this.props;
    let paramsClone = {...params};

    actions.updateReport({params: paramsClone});
    actions.setQueryState(true);

    let trackableParamData = Object.keys(paramsClone).map((key) =>
        PARAMS_TO_TRACK.includes(key) ? `${key}=${paramsClone[key]}` : key)
        .join('&');

    // Set it on the tracker so it gets sent with all Query Explorer hits.
    ga('set', 'dimension2', trackableParamData);

    let summaries = await accountSummaries.get();
    let viewId = params.viewId;
    let view = summaries.getView(viewId);
    let property = summaries.getPropertyByViewId(viewId);

    console.log('HandleSubmit');

    actions.updateReport({
      propertyName: property.name,
      viewName: view.name
    });
  }


  /**
   * Invoked when the DataChart component's "success" event emits.
   * @param {Object} data The object emitted by the DataChart's "success" event.
   */
  handleDataChartSuccess = (data) => {
    this.props.actions.setQueryState(false);
    this.props.actions.updateReport({response: data.response});

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
  handleDataChartError = ({error: {code, message}}) => {
    this.props.actions.setQueryState(false);
    this.props.actions.updateReport({params: null, response: null});

    AlertDispatcher.addOnce({
      title: `Ack! There was an error (${code})`,
      message: message
    });

    ga('send', {
      hitType: 'event',
      eventCategory: 'query',
      eventAction: 'submit',
      eventLabel: `(${code}) ${message}`,
      metric2: 1
    });
  }


  /**
   * Invoked when a user clicks on the include `viewId` checkbox.
   * @param {{target: Element}} includeViewId The React event.
   */
  handleViewIdToggle = ({target: {checked: includeViewId}}) => {
    this.props.actions.updateSettings({includeViewId});
  }


  /**
   * Invoked when a user clicks on the include `access_token` checkbox.
   * @param {{target: Element}} includeAccessToken The React event.
   */
  handleAccessTokenToggle = ({target: {checked: includeAccessToken}}) => {
    this.props.actions.updateSettings({includeAccessToken});
  }

  /**
   * Invoked when a user focuses on the "Direct link to this report" textarea.
   */
  handleDirectLinkFocus() {
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

  render() {

    let {
      isQuerying,
      params,
      report,
      settings,
      select2Options
    } = this.props;

    let formControlClass = 'FormControl FormControl--inline';
    let formActionClass = formControlClass + ' FormControl--action';
    let requiredFormControlClass = formControlClass +' FormControl--required';

    return (
      <div>
        <h3 className="H3--underline">Select a view</h3>

        <ViewSelector
          viewId={params.viewId}
          onChange={this.handleViewSelectorChange} />

        <h3 className="H3--underline">Set the query parameters</h3>

        <form onSubmit={this.handleSubmit}>

          <div className={requiredFormControlClass}>
            <label className="FormControl-label">viewId</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="viewId"
                  value={params.viewId}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.view_id" />
              </div>
            </div>
          </div>

          <div className={requiredFormControlClass}>
            <label className="FormControl-label">startDate</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Datepicker
                  name="startDate"
                  value={params['startDate']}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="DateRange.FIELDS.start_date" />
              </div>
            </div>
          </div>

          <div className={requiredFormControlClass}>
            <label className="FormControl-label">endDate</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Datepicker
                  name="endDate"
                  value={params['endDate']}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="DateRange.FIELDS.start_date" />
              </div>
            </div>
          </div>

          <div className={requiredFormControlClass}>
            <label className="FormControl-label">metrics</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="metrics"
                  value={params.metrics}
                  tags={select2Options.metrics}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.metrics" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">dimensions</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="dimensions"
                  value={params.dimensions}
                  tags={select2Options.dimensions}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.dimensions" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">Order By</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="sort"
                  value={params.sort}
                  tags={select2Options.sort}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.order_bys" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">Buckets</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="buckets"
                  value={params['buckets']}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="Dimension.FIELDS.histogram_buckets" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">filters</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="filters"
                  value={params.filters}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.filters_expression" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">segment</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <SearchSuggest
                  name="segment"
                  value={params.segment}
                  options={select2Options.segments}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.segments" />
              </div>
              <div className="FormControl-info">
                <label>
                  <input
                    className="Checkbox"
                    type="checkbox"
                    onChange={this.handleSegmentDefinitionToggle}
                    checked={settings.useDefinition} />
                  Show segment definitions instead of viewId.
                </label>
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">samplingLevel</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="samplingLevel"
                  value={params.samplingLevel}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.sampling_level" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">includeEmptyRows</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="includeEmptyRows"
                  value={params['includeEmptyRows']}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.include_empty_rows" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">pageToken</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="pageToken"
                  value={params['pageToken']}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.page_token" />
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">pageSize</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="pageSize"
                  value={params['pageSize']}
                  onChange={this.handleParamChange} />
                <HelpIconLink name="ReportRequest.FIELDS.page_size" />
              </div>
            </div>
          </div>

          <div className={formActionClass}>
            <div className="FormControl-body">
              <button
                className="Button Button--action"
                disabled={isQuerying}>
                {isQuerying ? 'Loading...' : 'Run Query'}
              </button>
            </div>
          </div>

        </form>

        <RequestViewer 
          params={params}

        />

        <BarChartComponent />

        <QueryReport
          report={report}
          isQuerying={isQuerying}
          includeViewId={settings.includeViewId}
          includeAccessToken={settings.includeAccessToken}
          onSuccess={this.handleDataChartSuccess}
          onError={this.handleDataChartError}
          onViewIdToggle={this.handleViewIdToggle}
          onAccessTokenToggle={this.handleAccessTokenToggle}
          onDirectLinkFocus={this.handleDirectLinkFocus}
          onApiUriFocus={this.handleApiUriFocus}
          onDownloadTsvClick={this.handleDownloadTsvClick} />

      </div>
    );
  }
}
