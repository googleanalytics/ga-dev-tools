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


import camelCase from 'camelcase';
import Datepicker from './datepicker';
import React from 'react';
import select2Tags from './select2-tags';


const REFERENCE_URL = 'https://developers.google.com' +
                      '/analytics/devguides/reporting/core/v3/reference#';


let FormControl = React.createClass({

  mixins: [select2Tags],

  getInitialState: function() {
    return {value: this.props.value}
  },

  handleChange: function(e) {
    this.setState({value: e.target.value});
    this.props.onChange.call(this, e);
  },

  componentWillReceiveProps: function(props) {
    this.setState({value: props.value});
  },

  render: function() {

    let blockName = 'FormControl';
    let modifiers = ['inline'];

    if (this.props.required) modifiers.push('required');

    let className = [blockName]
        .concat(modifiers.map(modifier => `${blockName}--${modifier}`))
        .join(' ');

    let formControlInfo = this.props.children ?
        (<div className="FormControl-info">{this.props.children}</div>) : '';

    let iconInfo =
        `<svg class="Icon" viewBox="0 0 16 16">
           <use xlink:href="/public/images/icons.svg#icon-info"></use>
         </svg>`;

    let input = (this.props.type == 'date') ?
        (
          <Datepicker
            name={this.props.name}
            value={this.state.value}
            onChange={this.handleChange} />
        ) : (
          <input
            className="FormField FormFieldCombo-field"
            name={this.props.name}
            value={this.state.value}
            onChange={this.handleChange}
            ref="input" />
        )


    return (
      <div className={className}>
        <label className="FormControl-label">{this.props.name}</label>
        <div className="FormControl-body">
          <div className="FormFieldCombo">
            {input}
            <a
              className="FormFieldCombo-help"
              href={REFERENCE_URL + camelCase(this.props.name)}
              tabIndex="-1"
              dangerouslySetInnerHTML={{__html: iconInfo}}></a>
          </div>
          {formControlInfo}
        </div>
      </div>
    );
  }
});

export default FormControl
