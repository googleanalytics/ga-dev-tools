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


import React from 'react';
import ParamElement from './param-element';


export default class ParamSelectElement extends ParamElement {

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /** @return {Object} */
  render() {
    // Only render a select if the value is one of the passed options.
    if (this.props.options.includes(this.state.value)) {
      return (
        <div className={this.getClassName()}>
          {this.renderLabel()}
          <div className="HitBuilderParam-body">
            <select
              className={this.getFieldClassName()}
              value={this.state.value || ''}
              onChange={this.handleValueChange}>
              {this.props.options.map((option) => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
            {this.renderHelpIcon()}
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
