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
import AggregateChart from './charts/aggregate-chart';
import BreakdownChart from './charts/breakdown-chart';
import RequestForm from './request-form';
import * as trendReport from '../trend-report';
import AlertDispatcher from '../../components/alert-dispatcher';


/**
 * The primary Usage Trends tool component.
 */
export default class UsageTrends extends Component {
  /**
   * Handles submit events to the RequestForm component.
   * @param {Object} event
   */
  handleSubmit = (event) => {
    event.preventDefault();

    const {actions} = this.props;
    actions.updateReport({isQuerying: true});

    const params = {...this.props.params};
    trendReport.create(params)
        .then((report) => {
          actions.updateReport({...report, isQuerying: false});
          import('../analytics.js').then((analytics) => {
            analytics.trackReportCreate();
          });
        })
        .catch((err) => {
          actions.updateReport({
            isQuerying: false,
            aggregateRowData: null,
            breakdownRowData: null,
          });

          if (err.code) {
            AlertDispatcher.addOnce({
              title: 'Oops, something went wrong',
              message: `(${err.code}) ${err.message}`,
            });
            import('../analytics.js').then((analytics) => {
              analytics.trackReportError(err);
            });
          } else {
            this.handleError(err);
          }
        });
  }

  /**
   * Handles errors making the API request.
   * @param {Error} err
   */
  handleError(err) {
    AlertDispatcher.addOnce({
      title: err.title || 'Oops, something went wrong',
      message: err.message,
    });
    import('../analytics.js').then((analytics) => analytics.trackError(err));
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
      <div>
        {!props.auth.isSignedIn ? null : (
          <RequestForm
            actions={props.actions}
            params={props.params}
            options={props.options}
            report={props.report}
            onSubmit={this.handleSubmit} />
        )}
        {!props.report.aggregateRowData ? null : (
          <div>
            <section>
              <h2>Results</h2>
              <p>
                The first chart below shows how each dimension in the
                results compares to each other. Below that is a breakdown
                chart for each individual dimension along with a trend line.
              </p>
            </section>
            <AggregateChart dataset={props.report.aggregateRowData} />
            <h3>Results breakdown</h3>
            {props.report.breakdownRowData &&
                Object.keys(props.report.breakdownRowData).map((key, i) => (
                  <BreakdownChart
                    title={key}
                    key={key}
                    index={i}
                    dataset={props.report.breakdownRowData[key]} />
                ))}
          </div>
        )}
      </div>
    );
  }
}
