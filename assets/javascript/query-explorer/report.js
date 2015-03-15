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


import DataChart from './data-chart';
import omit from 'lodash/object/omit';
import qs from 'querystring';
import React from 'react';


const API_URI_ORIGIN = 'https://www.googleapis.com/analytics/v3/data/ga?';


var Report = React.createClass({

  reportLink: function() {
    var query = (this.props.includeIds) ?
        this.props.report.params : omit(this.props.report.params, 'ids');
    return location.protocol + '//' + location.host +
           location.pathname + '?' + qs.stringify(query);
  },

  apiQueryUri: function() {
    return API_URI_ORIGIN + qs.stringify(this.props.report.params);
  },

  render: function() {

    var partials = {};
    let report = this.props.report;
    let error = report && report.error;
    let accountData = report && report.accountData;
    let response = report && report.response;
    let params = report && report.params;

    if (accountData) {
      partials.reportTitle = (
        <h2 className="Report-title">
          {accountData.property.name} ({accountData.view.name})
        </h2>
      )
    }

    if (error) {
      partials.reportError = (
        <aside className="Error">
          <h3 className="Error-title">
            Ack! There was an error ({error.code})
          </h3>
          <p className="Error-message">{error.message}</p>
        </aside>
      )
    }

    if (response) {
      let resultsShowing = response.dataTable.rows &&
          response.dataTable.rows.length || 0;
      let totalResults = response.totalResults || 0;
      let sampledData = response.containsSampledData ? 'Yes' : 'No'

      partials.reportMeta = (
        <aside className="Report-meta">
          <ul className="InlineDefinitionList">
            <li className="InlineDefinitionList-item">
              <span className="InlineDefinitionList-itemName">
                Results showing:
              </span>
              <span className="InlineDefinitionList-itemValue">
                {resultsShowing}</span>
            </li>
            <li className="InlineDefinitionList-item">
              <span className="InlineDefinitionList-itemName">
                Total results found:</span>
              <span className="InlineDefinitionList-itemValue">
                {totalResults}</span>
            </li>
            <li className="InlineDefinitionList-item">
              <span className="InlineDefinitionList-itemName">
                Contains sampled data:</span>
              <span className="InlineDefinitionList-itemValue">
                {sampledData}</span>
            </li>
          </ul>
        </aside>
      );

      partials.reportLink = (
        <div className="Report-item">
          <div className="FormControl FormControl--full">
            <label className="FormControl-label">
              Direct link to this Report</label>
            <div className="FormControl-body">
              <textarea
                rows="3"
                className="FormField"
                value={this.reportLink()}
                readOnly>
              </textarea>
              <label className="FormControl-info">
                <input
                  className="Checkbox"
                  type="checkbox"
                  onChange={this.props.onIdsToggle}
                  checked={this.props.includeIds} />
                  Include <code>ids</code> paramter in the link above
                  (uncheck if sharing publicly).
              </label>
            </div>
          </div>
        </div>
      );

      partials.reportQueryUri = (
        <div className="Report-item">
          <div className="FormControl FormControl--full">
            <label className="FormControl-label">API Query URI</label>
            <div className="FormControl-body">
              <textarea
                rows="3"
                className="FormField"
                value={this.apiQueryUri()}
                readOnly>
              </textarea>
            </div>
          </div>
        </div>
      );

      partials.reportDownloadLink = (
        <div className="Report-item">
          <a download className="Button Button--icon" id="save-tsv">
            Download Results as TSV
          </a>
        </div>
      );
    }

    return (
      <div className="Report" hidden={!response && !error}>
        {partials.reportTitle}
        {partials.reportError}
        {partials.reportMeta}
        <DataChart
          hidden={!response}
          className="Report-item"
          params={params}
          isQuerying={this.props.isQuerying}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError} />
        {partials.reportLink}
        {partials.reportQueryUri}
        {partials.reportDownloadLink}
      </div>
    );
  }
});


export default Report
