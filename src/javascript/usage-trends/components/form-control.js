// Copyright 2017 Google Inc. All rights reserved.
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


import React, {Component} from 'react';

// Styles
import formControlStyles from './form-control.css';
import formFieldStyles from '../styles/form-field.css';


/**
 * The primary Usage Trends app component.
 */
export default class FormControl extends Component {
  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /** @return {Object} The React component. */
  render() {
    const classes = [formControlStyles.root];
    if (this.props.full) classes.push(formControlStyles._full);
    if (this.props.action) classes.push(formControlStyles._action);

    return (
      <div className={classes.join(' ')}>
        {!this.props.label ? null : (
          <label className={formControlStyles.label}>
            {this.props.label}
          </label>
        )}
        <div className={formControlStyles.body}>
          {this.props.children || (
            <select className={formFieldStyles.root} disabled />
          )}
        </div>
      </div>
    );
  }
}
