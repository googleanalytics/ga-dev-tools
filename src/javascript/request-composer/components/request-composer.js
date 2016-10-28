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
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import RequestViewer from './request-viewer';
import ResponseViewer from './response-viewer';

import {batchGet, composeRequest, validateRequest} from '../request';

import AlertDispatcher from '../../components/alert-dispatcher';
import Datepicker from '../../components/datepicker';
import HelpIconLink from '../../components/help-icon-link';
import Select2MultiSuggest from '../../components/select2-multi-suggest';
import SearchSuggest from '../../components/search-suggest';
import ViewSelector from '../../components/view-selector';


/**
 * The parameters that are safe to track the values entered by users.
 * All other params are either uninteresting or may possibly contain PII and
 * therefore only their presence/absense is tracked.
 */
const REQUEST_TYPES = ['HISTOGRAM', 'PIVOT', 'COHORT'];
const COHORT_SIZES = ['Day', 'Week', 'Month'];
const SAMPLING_LEVELS = ['', 'DEFAULT', 'SMALL', 'LARGE'];
const INCLUDE_EMPTY_ROWS_VALUES = ['', false, true];

const REFERENCE_URL =
    'https://developers.google.com' +
    '/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#';


/**
 * The primary Request Composer app component.
 */
export default class RequestComposer extends React.Component {

  /**
   * Invoked when a user changes the ViewSelector2 instance.
   * @param {Object} viewData The object emited by the ViewSelector2's
   * `changeView` event.
   */
  handleViewSelectorChange = (viewData) => {
    let {actions} = this.props;
    let viewId = viewData.view.id;
    actions.updateParams({viewId});
    actions.updateMetricsDimensionsAndSortOptions(viewData);
  }


  /**
   * Invoked when a user changes any of the <QueryForm> fields.
   * @param {Event|Object} e A native Event object, React event, or data object
   *     containing the target.name and target.value properties.
   */
  handleParamChange = ({target: {name, value}}) => {
    // Convert the string values 'true' and 'false' to boolean values
    value = value == 'true' ? true : (value == 'false' ? false : value);
    this.props.actions.updateParams({[name]: value});

    if (name == 'metrics' || name == 'dimensions') {
      this.props.actions.updateSortOptions();
    }
  }


  /**
   * Invoked when a user changes the request type.
   * @param {Int} index The index of the selcected request tab.
   */
  handleRequestChange = (index) => {
    this.props.actions.updateSettings({requestType: REQUEST_TYPES[index]});
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
   * Invoked when a user submits the form.
   * @param {Event|Object} e The native or React event.
   * @return {Object} null if missing required fields.
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    let {actions, params, settings} = this.props;

    if (!validateRequest(params, settings)) {
      AlertDispatcher.addOnce({
        title: 'Oops, there was an error',
        message: 'Please supply all required fields.',
      });
      return null;
    }


    let request = composeRequest(params, settings);
    let response;

    actions.setQueryState(true);
    try {
      response = await batchGet(request);
    } catch (response) {
      AlertDispatcher.addOnce({
        title: 'Oops, there was an error',
        message: response.result.error.message,
      });
      actions.updateResponse(response);
    }

    actions.updateResponse(response);
    actions.updateSettings({
      responseType: settings.requestType,
      responseCohortSize: params.cohortSize,
    });

    actions.setQueryState(false);
  }


  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /** @return {Object} The React component. */
  render() {
    let {
      isQuerying,
      params,
      response,
      settings,
      select2Options,
    } = this.props;

    let formControlClass = 'FormControl FormControl--inline';
    let formActionClass = formControlClass + ' FormControl--action';
    let requiredFormControlClass = formControlClass +' FormControl--required';
    let maximumSelectionSize = 7;

    return (
      <div>

        <Tabs
          onSelect={this.handleRequestChange}
          selectedIndex={REQUEST_TYPES.indexOf(settings.requestType)}
        >
          <TabList>
            <Tab>Histogram Request</Tab>
            <Tab>Pivot Request</Tab>
            <Tab>Cohort Request</Tab>
          </TabList>
          <TabPanel>
            <p>For dimensions with integer values, it is easier to understand
              their characteristics by bucketing their values into ranges.
            </p>
          </TabPanel>
          <TabPanel>
            <p>Google Analytics Reporting API v4 allows you to generate pivot
              tables. To construct a request with a pivot table, define the
              pivot field in the ReportRequest.
            </p>
          </TabPanel>
          <TabPanel>
            <p>A cohort is a group of users who share a common characteristic.
              For example, all users with the same Acquisition Date belong to
              the same cohort. The cohort analysis report lets you isolate and
              analyze cohort behavior.
            </p>
          </TabPanel>
        </Tabs>

        <h3 className="H3--underline">Select account, property, and view</h3>

        <ViewSelector
          viewId={params.viewId}
          onChange={this.handleViewSelectorChange} />

        <h3 className="H3--underline">Set query parameters</h3>

        <form onSubmit={this.handleSubmit}>

          <div className={requiredFormControlClass}>
            <label className="FormControl-label">viewId</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="viewId"
                  value={params.viewId || ''}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.view_id" />
              </div>
            </div>
          </div>

          {settings.requestType != 'COHORT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">startDate</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Datepicker
                  name="startDate"
                  value={params['startDate']}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="DateRange.FIELDS.start_date" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType != 'COHORT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">endDate</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Datepicker
                  name="endDate"
                  value={params['endDate']}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="DateRange.FIELDS.start_date" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType != 'COHORT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">metrics</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="metrics"
                  value={params.metrics || ''}
                  tags={select2Options.metrics}
                  onChange={this.handleParamChange}
                  maximumSelectionSize={maximumSelectionSize} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.metrics" />
              </div>
            </div>
          </div>
          ) :
          null}


          {settings.requestType == 'HISTOGRAM' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Histogram dimension</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="histogramDimensions"
                  value={params.histogramDimensions || ''}
                  tags={select2Options.histogramDimensions}
                  onChange={this.handleParamChange}
                  maximumSelectionSize={1} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.dimensions" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">dimensions</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="dimensions"
                  value={params.dimensions || ''}
                  tags={select2Options.dimensions}
                  onChange={this.handleParamChange}
                  maximumSelectionSize={maximumSelectionSize} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.dimensions" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'COHORT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Cohort Metric</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="cohortMetrics"
                  value={params.cohortMetrics || ''}
                  tags={select2Options.cohortMetrics}
                  onChange={this.handleParamChange}
                  maximumSelectionSize={1} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.metrics" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'COHORT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Cohort Size</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <select
                  className="FormField FormFieldCombo-field"
                  value={params.cohortSize || ''}
                  name="cohortSize"
                  onChange={this.handleParamChange}>
                  {COHORT_SIZES.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.cohorts" />
              </div>
            </div>
          </div>
          ) :
          null}


          {settings.requestType == 'PIVOT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Pivot Metrics</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="pivotMetrics"
                  value={params.pivotMetrics || ''}
                  tags={select2Options.pivotMetrics}
                  onChange={this.handleParamChange}
                  maximumSelectionSize={maximumSelectionSize} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="Pivot.FIELDS.metrics" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Pivot Dimensions</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="pivotDimensions"
                  value={params.pivotDimensions || ''}
                  tags={select2Options.pivotDimensions}
                  onChange={this.handleParamChange}/>
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="Pivot.FIELDS.dimensions" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">Pivot startGroup</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="startGroup"
                  value={params['startGroup'] || ''}
                  onChange={this.handleParamChange}/>
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="Pivot.FIELDS.startGroup" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">Pivot maxGroupCount</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="maxGroupCount"
                  value={params['maxGroupCount'] || ''}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="Pivot.FIELDS.maxGroupCount" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">Order By</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <Select2MultiSuggest
                  name="sort"
                  value={params.sort || ''}
                  tags={select2Options.sort}
                  onChange={this.handleParamChange}
                  maximumSelectionSize={maximumSelectionSize} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.order_bys" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'HISTOGRAM' ? (
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Buckets</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="buckets"
                  value={params['buckets'] || ''}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="Dimension.FIELDS.histogram_buckets" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType != 'COHORT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">filters Expression</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="filters"
                  value={params.filters || ''}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.filters_expression" />
              </div>
            </div>
          </div>
          ) :
          null}

          <div className={formControlClass}>
            <label className="FormControl-label">segment</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <SearchSuggest
                  name="segment"
                  value={params.segment || ''}
                  options={select2Options.segments}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.segments" />
              </div>
              <div className="FormControl-info">
                <label>
                  <input
                    className="Checkbox"
                    type="checkbox"
                    onChange={this.handleSegmentDefinitionToggle}
                    checked={!!settings.useDefinition} />
                  Show segment definitions instead of segment IDs.
                </label>
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">samplingLevel</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <select
                  className="FormField FormFieldCombo-field"
                  value={params['samplingLevel'] || ''}
                  name="samplingLevel"
                  onChange={this.handleParamChange}>
                  {SAMPLING_LEVELS.map((option, i) => (
                    <option value={option} key={i}>{option}</option>
                  ))}
                </select>
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.sampling_level" />
              </div>
            </div>
          </div>

          {settings.requestType == 'PIVOT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">includeEmptyRows</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <select
                  className="FormField FormFieldCombo-field"
                  value={String(params['includeEmptyRows']) || ''}
                  name="includeEmptyRows"
                  onChange={this.handleParamChange}>
                  {INCLUDE_EMPTY_ROWS_VALUES.map((option, i) => (
                    <option
                      value={String(option)}
                      key={i}>
                      {String(option)}
                    </option>
                  ))}
                </select>
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.include_empty_rows" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">pageToken</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="pageToken"
                  value={params['pageToken'] || ''}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.page_token" />
              </div>
            </div>
          </div>
          ) :
          null}

          {settings.requestType == 'PIVOT' ? (
          <div className={formControlClass}>
            <label className="FormControl-label">pageSize</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <input
                  className="FormField FormFieldCombo-field"
                  name="pageSize"
                  value={params['pageSize'] || ''}
                  onChange={this.handleParamChange} />
                <HelpIconLink
                  url={REFERENCE_URL}
                  name="ReportRequest.FIELDS.page_size" />
              </div>
            </div>
          </div>
          ) :
          null}

          <div className={formActionClass}>
            <div className="FormControl-body">
              <button
                className="Button Button--action"
                disabled={isQuerying}>
                {isQuerying ? 'Loading...' : 'Make Request'}
              </button>
            </div>
          </div>
          {response.result && settings.responseType == settings.requestType? (
            <p>
              <a href="#results">&#8595;&nbsp; Skip to results</a>
            </p>
          ) :
          null}

        </form>

        <RequestViewer
          params={params}
          settings={settings}
        />

        <ResponseViewer
          response={response}
          settings={settings}
        />


      </div>
    );
  }
}
