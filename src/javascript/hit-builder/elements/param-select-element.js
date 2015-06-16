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


import Icon from '../../elements/icon';
import ParamElement from './param-element';
import React from 'react';


const REFERENCE_URL = 'https://developers.google.com/' +
                      'analytics/devguides/collection/protocol/v1/parameters';


export default class ParamSelectElement extends ParamElement {

  render() {
    let {name, value} = this.state;

    // Only render a select if the value is one of the passed options.
    if (this.props.options.includes(value)) {
      return (
        <div className={this.getClassName()}>
          {this.renderLabel()}
          <div className="HitBuilderParam-body">
            <select
              className="FormField"
              value={value}
              onChange={this.handleValueChange}>
              {this.props.options.map((option) => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
            <a
              href={`${REFERENCE_URL}#${name}`}
              title={`Read the documentation for the "${name}" parameter.`}
              className="HitBuilderParam-helpIcon">
              <Icon type="info-outline" />
            </a>
            {this.renderMessage()}
          </div>
        </div>
      );
    }
    // Otherwise render a regular input.
    else {
      return super.render.call(this);
    }
  }
}
