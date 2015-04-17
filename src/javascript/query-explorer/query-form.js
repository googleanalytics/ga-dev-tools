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


import FormControl from './form-control';
import React from 'react';


var QueryForm = React.createClass({

  render: function() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <FormControl
          value={this.props.params.ids}
          name="ids"
          onChange={this.props.onChange}
          placeholder="ga:XXXX"
          required />
        <FormControl
          value={this.props.params['start-date']}
          name="start-date"
          onChange={this.props.onChange}
          type="date"
          placeholder="YYYY-MM-DD"
          required />
        <FormControl
          value={this.props.params['end-date']}
          name="end-date"
          onChange={this.props.onChange}
          type="date"
          placeholder="YYYY-MM-DD"
          required />
        <FormControl
          name="metrics"
          value={this.props.params.metrics}
          onChange={this.props.onChange}
          type="search"
          options={this.props.metrics}
          required />
        <FormControl
          name="dimensions"
          value={this.props.params.dimensions}
          onChange={this.props.onChange}
          type="search"
          options={this.props.dimensions} />
        <FormControl
          name="sort"
          value={this.props.params.sort}
          onChange={this.props.onChange} />
        <FormControl
          name="filters"
          value={this.props.params.filters}
          onChange={this.props.onChange} />
        <FormControl
          name="segment"
          value={this.props.params.segment}
          onChange={this.props.onChange}
          type="search"
          options={this.props.segments}>
          <label>
            <input
              className="Checkbox"
              type="checkbox"
              onChange={this.props.onSegmentDefinitionToggle}
              checked={this.props.useDefinition} />
            Show segment definitions instead of IDs.
          </label>
        </FormControl>
        <FormControl
          name="samplingLevel"
          value={this.props.params.samplingLevel}
          onChange={this.props.onChange} />
        <FormControl
          name="start-index"
          value={this.props.params['start-index']}
          onChange={this.props.onChange} />
        <FormControl
          name="max-results"
          value={this.props.params['max-results']}
          onChange={this.props.onChange} />

        <div className="FormControl FormControl--inline FormControl--action">
          <div className="FormControl-body">
            <button
              className="Button Button--action"
              disabled={this.props.isQuerying}>
              {this.props.isQuerying ? 'Loading...' : 'Run Query'}
            </button>
          </div>
        </div>
      </form>
    );
  }
});


export default QueryForm
