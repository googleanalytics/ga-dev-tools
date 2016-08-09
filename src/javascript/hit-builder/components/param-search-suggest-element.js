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
import SearchSuggest from '../../components/search-suggest';


export default class ParamSearchSuggestElement extends ParamElement {

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /** @return {Object} */
  render() {
    return (
      <div className={this.getClassName()}>
        {this.renderLabel()}
        <div className="HitBuilderParam-body">
          <SearchSuggest
            name="segment"
            value={this.state.value}
            placeholder={this.props.placeholder}
            options={this.props.options}
            invalid={this.props.message}
            onChange={this.handleValueChange} />
          {this.renderHelpIcon()}
          {this.renderMessage()}
        </div>
      </div>
    );
  }
}
