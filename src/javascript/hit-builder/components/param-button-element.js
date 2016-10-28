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
import Icon from '../../components/icon';


/**
 * A ParamElement component whose value has a Button component appended.
 */
export default class ParamButtonElement extends ParamElement {

  /**
   * Returns the class name for the form field.
   * @return {string}
   */
  getFieldClassName() {
    return super.getFieldClassName() + ' FormFieldAddOn-field';
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /** @return {Object} The React component. */
  render() {
    return (
      <div className={this.getClassName()}>
        {this.renderLabel()}
        <div className="HitBuilderParam-body">
          <div className="FormFieldAddOn">
            <input
              className={this.getFieldClassName()}
              value={this.state.value || ''}
              placeholder={this.getPlaceholder()}
              onChange={this.handleValueChange} />
            <button
              type="button"
              className="FormFieldAddOn-item"
              onClick={this.props.onClick}
              title={this.props.title}
              tabIndex="-1">
              <Icon type={this.props.type} />
            </button>
          </div>
          {this.renderHelpIcon()}
          {this.renderMessage()}
        </div>
      </div>
    );
  }
}
