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


var QueryResults = React.createClass({

  reportLink: function() {
    var query = (this.props.includeIds) ?
        this.props.query : omit(this.props.query, 'ids');
    return location.protocol + '//' + location.host +
           location.pathname + '?' + qs.stringify(query);
  },

  apiQueryUri: function() {
    return API_URI_ORIGIN + qs.stringify(this.props.query);
  },

  render: function() {

    var resultsShowing = this.props.hasReport &&
        this.props.result.dataTable.rows &&
        this.props.result.dataTable.rows.length || 0;

    var totalResults = this.props.hasReport &&
        this.props.result.totalResults || 0;

    var sampledData = this.props.hasReport &&
        this.props.result.containsSampledData ? 'Yes' : 'No'

    return (
      <div className="QueryResults" hidden={!this.props.hasReport}>
        <h2 className="QueryResults-title">
          {this.props.property} ({this.props.view})
        </h2>

        <aside className="QueryResults-meta">
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

        <DataChart
          className="QueryResults-item"
          query={this.props.query}
          isQuerying={this.props.isQuerying}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError} />


        <div className="QueryResults-item">
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

        <div className="QueryResults-item">
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

        <a download className="Button Button--icon" id="save-tsv">
          Download Results as TSV
        </a>

      </div>
    );
  }
});


export default QueryResults
