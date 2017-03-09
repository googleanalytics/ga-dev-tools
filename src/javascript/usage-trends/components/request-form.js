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


import metadata from 'javascript-api-utils/lib/metadata';
import React, {Component} from 'react';
import ParamSelector from './param-selector';
import ViewSelector from './view-selector';

// Styles
import styles from './request-form.css';


/**
 * A from component to create the trend report request.
 */
export default class RequestForm extends Component {
  /**
   * Handles changes to the to the active view from the ViewSelector and
   * updates the account tree based on the newly selected view.
   * @param {{account: (Object), property: (Object), view: (Object)}} arg1
   */
  handleViewChange = ({account, property, view}) => {
    const {actions} = this.props;

    actions.updateParams({viewId: view.id});

    getMetrics(account, property, view)
        .then((metrics) => actions.updateOptions({metrics}))
        .catch((err) => this.handleError(err));

    getDimensions(account, property, view)
        .then((dimensions) => actions.updateOptions({dimensions}))
        .catch((err) => this.handleError(err));
  }

  /**
   * Handles param changes from the ParamSelector component.
   * @param {{target: (Element)}} arg1
   */
  handleParamChange = ({target}) => {
    this.props.actions.updateParams({[target.name]: target.value});
    import('../analytics.js').then((analytics) => {
      analytics.setParams(this.props.params);
      analytics.trackParamChange(target.name);
    });
  }

  /**
   * Handles clicks on param preset buttons.
   * @param {string} preset The preset name.
   * @param {Object} params The new params to set.
   */
  handleClickPreset = (preset, params) => {
    this.props.actions.updateParams(params);
    import('../analytics.js').then((analytics) => {
      analytics.setParams(this.props.params);
      analytics.trackPresetSelect(preset);
    });
  }

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /** @return {Object} The React component. */
  render() {
    const {props} = this;

    return (
      <section>
        <form className={styles.form} onSubmit={props.onSubmit}>
          <div className={styles.fieldGroups}>
            <div className={styles.fieldGroup}>
              <h3 className={styles.heading}>
                1. Select a Google Analytics view
              </h3>
              <ViewSelector
                viewId={props.params.viewId}
                actions={props.actions}
                onChange={this.handleViewChange} />
            </div>
            <div className={styles.fieldGroup}>
              <h3 className={styles.heading}>
                2. Choose your query parameters
              </h3>
              <ParamSelector
                onChange={this.handleParamChange}
                params={props.params}
                options={props.options} />
            </div>
          </div>
          <div className={styles.examples}>
            <p><b>Not sure which parameters to choose? </b>Try one of the
            suggested reports below. Just click the link to update the query
            parameters, then click "Create trend report".</p>
            <ul className={styles.exampleList}>
              <li>
                <button
                  type="button"
                  onClick={this.handleClickPreset.bind(null,
                      'ga:sessions/ga:deviceCategory',
                      {
                        metric: 'ga:sessions',
                        dimension: 'ga:deviceCategory',
                      }
                  )}>
                  Desktop/mobile usage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={this.handleClickPreset.bind(null,
                      'ga:sessions/ga:browser',
                      {
                        metric: 'ga:sessions',
                        dimension: 'ga:browser',
                      }
                  )}>
                  Browser usage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={this.handleClickPreset.bind(null,
                      'ga:sessions/ga:country',
                      {
                        metric: 'ga:sessions',
                        dimension: 'ga:country',
                      }
                  )}>
                  Usage by country
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={this.handleClickPreset.bind(null,
                      'ga:sessions/ga:userType',
                      {
                        metric: 'ga:sessions',
                        dimension: 'ga:userType',
                      }
                  )}>
                  New/returning users
                </button>
              </li>
            </ul>
          </div>
          <div className={styles.submit}>
            <button
              className="Button Button--action"
              disabled={props.report.isQuerying}>
              {props.report.isQuerying ? 'Loading...' : 'Create trend report'}
            </button>
          </div>
        </form>
      </section>
    );
  }
}


/**
 * Gets a list of all public, v3 metrics associated with the passed view.
 * @param {Object} account An account object from the Metadata API.
 * @param {Object} property A property object from the Metadata API.
 * @param {Object} view A view object from the Metadata API.
 * @return {Promise} A promise resolved with an array of all public metrics.
 */
function getMetrics(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    const metrics = columns.allMetrics((metric, id) => {
      // TODO(philipwalton): remove this temporary inclusion once the new
      // ga:uniqueEvents metric is no longer listed as deprecated in the API.
      if (id == 'ga:uniqueEvents') {
        metric.uiName = 'Unique Events';
        return true;
      }

      // TODO(philipwalton): remove this temporary exclusion once
      // caclulated metrics can be templatized using the Management API.
      if (id == 'ga:calcMetric_<NAME>') return false;

      // Calculated (or non-totalable) metrics are excluded because there's
      // no concept of a "total" to divide by.
      if (metric.calculation) return false;

      // Else, return true if the metric is public.
      return metric.status == 'PUBLIC';
    });

    const groups = {};
    for (const metric of metrics) {
      const {group} = metric.attributes;
      groups[group] = groups[group] || [];
      groups[group].push(metric);
    }
    return groups;
  });
}


/**
 * Gets a list of all public, v3 dimensions associated with the passed view.
 * @param {Object} account An account object from the Metadata API.
 * @param {Object} property A property object from the Metadata API.
 * @param {Object} view A view object from the Metadata API.
 * @return {Promise} A promise resolved with an array of all public dimensions.
 */
function getDimensions(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    const dimensions = columns.allDimensions({status: 'PUBLIC'});

    const groups = {};
    for (const dimension of dimensions) {
      const {group} = dimension.attributes;
      groups[group] = groups[group] || [];
      groups[group].push(dimension);
    }
    return groups;
  });
}
