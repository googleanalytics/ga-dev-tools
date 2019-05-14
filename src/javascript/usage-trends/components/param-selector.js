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
import FormControl from './form-control';

// Styles
import styles from './param-selector.css';
import formField from '../styles/form-field.css';


/**
 * A component for choosing the params to use in the trend report.
 */
export default class ParamSelector extends Component {
  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /** @return {Object} The React component. */
  render() {
    const {onChange, options, params} = this.props;

    const metrics = (
      <FormControl full label="Metric">
        {!options.metrics ? null : (
          <select
            className={formField.root}
            name="metric"
            value={params.metric}
            onChange={onChange}>{
              Object.keys(options.metrics).map((group) => (
                <optgroup key={group} label={group}>{
                  options.metrics[group].map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.attributes.uiName}
                    </option>
                  ))
                }</optgroup>
              ))
            }</select>
        )}
      </FormControl>
    );

    const dimensions = (
      <FormControl full label="Dimension">
        {!options.dimensions ? null : (
          <select
            className={formField.root}
            name="dimension"
            value={params.dimension}
            onChange={onChange}>{
              Object.keys(options.dimensions).map((group) => (
                <optgroup key={group} label={group}>{
                  options.dimensions[group].map((dimension) => (
                    <option key={dimension.id} value={dimension.id}>
                      {dimension.attributes.uiName}
                    </option>
                  ))
                }</optgroup>
              ))
            }</select>
        )}
      </FormControl>
    );

    const dateRange = (
      <FormControl full label="Time Frame">
        <select
          className={formField.root}
          name="dateRange"
          value={params.dateRange}
          onChange={onChange}>
          <option value="180">Past 6 months</option>
          <option value="365">Past year</option>
          <option value="730">Past 2 years</option>
          <option value="1095">Past 3 years</option>
        </select>
      </FormControl>
    );

    const maxResults = (
      <FormControl full label="Max Results">
        <select
          className={formField.root}
          name="maxResults"
          value={params.maxResults}
          onChange={onChange}>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <option key={i} value={i}>{i}</option>)
          )}
        </select>
      </FormControl>
    );

    return (
      <div className={styles.root}>
        <div className={styles.item}>{metrics}</div>
        <div className={styles.item}>{dimensions}</div>
        <div className={styles.item}>
          <div className={styles.dateRange}>{dateRange}</div>
          <div className={styles.maxResults}>{maxResults}</div>
        </div>
      </div>
    );
  }
}
