// Copyright 2016 Google Inc. All rights reserved.
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


const cohortDateRanges = {
  Day: 8,
  Week: 6,
  Month: 3,
};


/**
 * Accepts the report object from the API response and the cohort size and
 * returns a two-dimensional array representing the table rows and cells.
 * @param {Object} report The API response's report object.
 * @param {number} cohortSize
 * @return {Array}
 */
function tablizeCohortReportData(report, cohortSize) {
  let headers = ['Cohort'];
  let currentDataRow = [];
  let dataRows = [headers];

  for (let i = 0; i <= cohortDateRanges[cohortSize]; i++) {
    headers.push(`${cohortSize} ${i}`);
  }

  if (report.data.rows && report.data.rows.length) {
    for (let row of report.data.rows) {
      if (row.dimensions && row.dimensions.length == 2) {
        let rowKey = row.dimensions[0];

        if (rowKey != currentDataRow[0]) {
          currentDataRow = [];
          dataRows.push(currentDataRow);
          currentDataRow[0] = rowKey;
        }

        let value = row.metrics[0].values[0];
        let valueType =
            report.columnHeader.metricHeader.metricHeaderEntries[0].type;

        if (valueType == 'PERCENT') {
          value = (Math.round(value * 100) / 100) + '%';
        }
        if (valueType == 'CURRENCY') {
          value = '$' + (+value).toFixed(2);
        }

        currentDataRow.push(value);
      }
    }
  }

  return dataRows;
}


/**
 * A components that renders the cohort table visualization.
 */
export default class CohortTable extends React.Component {

  /** @return {Object} The React component. */
  render() {
    let {response, settings} = this.props;
    let report = response.result.reports[0];
    let [headers, ...rows] = tablizeCohortReportData(
        report, settings.responseCohortSize);

    return (
      <div className="CohortTable">
        <table className="CohortTable-table">
          <thead>
            <tr className="CohortTable-tr">
              {headers.map((header, i) => (
                <th className="CohortTable-th" key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr className="CohortTable-tr" key={i}>
                {row.map((col, i) => (
                  <td className="CohortTable-td" key={i}>{col}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
