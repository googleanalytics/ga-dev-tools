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


import uniq from 'lodash/uniq';
import React from 'react';
import metadata from 'javascript-api-utils/lib/metadata';

let columns;
window.addEventListener('load', () => {
  metadata.get().then((c) => {
    columns = c;
  });
});


/**
 * Accepts a string value and API type and formats it accordingly.
 * @param {string} value
 * @param {string} type
 * @return {string} The formatted value.
 */
function formatValue(value, type) {
  if (type == 'PERCENT') {
    value = (Math.round(value * 100) / 100) + '%';
  } else if (type == 'CURRENCY') {
    value = '$' + (+value).toFixed(2);
  }
  return value;
}


/**
 * Accepts a string dimension value and the name of a dimensions and formats
 * the value if necessary.
 * @param {string} value
 * @param {string} name
 * @return {string} The formatted value.
 */
function formatDimension(value, name) {
  if (name == 'ga:date') {
    value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
  }
  return value;
}


/**
 * Takes a cell object and a neighboring cell object (either above to to the
 * left) and merges them if their `dimension` values are equal.
 * The merge is done by updating the neighboring cell's rowspan or colspan
 * attributes. If the neighboring cell is already part of a merged group of
 * cells, the `ref` property is followed an the original cell is updated.
 * @param {Object} cell A cell object to compare with a neighoring cell.
 * @param {Object} neighbor A cell object to update if a merge is possible.
 */
function mergeCellWithNeighborIfSame(cell, neighbor) {
  if (cell.dimensions === neighbor.dimensions) {
    cell.ref = neighbor.ref || neighbor;
    cell.ref.classes.push(...cell.classes);

    if (cell.r === cell.ref.r) {
      cell.ref.colSpan = cell.c - cell.ref.c + 1;
    } else {
      cell.ref.rowSpan = cell.r - cell.ref.r + 1;
    }
  }
}


/**
 * Accepts the report object from the API response and returns a
 * two-dimensional array representing the table rows and cells.
 * @param {Object} report The API response's report object.
 * @return {Array}
 */
function constructPivotTableCellFromReport(report) {
  // Create local aliases.
  let {columnHeader, data: {rows, totals}} = report;

  if (!rows) return;

  let {metricHeaderEntries = []} = columnHeader.metricHeader;
  let {pivotHeaderEntries = []} = columnHeader.metricHeader.pivotHeaders[0];
  let {dimensions} = columnHeader;
  let pivotDimensions = pivotHeaderEntries[0].dimensionNames;

  let dimensionHeaderEndRow = pivotDimensions.length - 1;
  let metricHeaderRow = dimensionHeaderEndRow + 1;
  let resultsStartRow = metricHeaderRow + 1;
  let resultsEndRow = resultsStartRow + rows.length - 1;
  let totalsRow = resultsEndRow + 1;

  let dimensionEndCol = dimensions.length - 1;
  let metricStartCol = dimensionEndCol + 1;
  let metricEndCol = metricStartCol + metricHeaderEntries.length - 1;
  let pivotStartCol = metricEndCol + 1;
  let pivotEndCol = pivotStartCol + pivotHeaderEntries.length - 1;

  let rowCount = totalsRow + 1;
  let colCount = pivotEndCol + 1;

  // Creates the initial list of cells.
  // This will be a two-dimensional array: cells[<tr>][<td>].
  let cells = [];

  // Adds empty cells in the upper left corner.
  for (let r = 0; r < rowCount; r++) {
    cells[r] = cells[r] || [];

    for (let c = 0; c < colCount; c++) {
      // Creates a new cell object.
      let cell = cells[r][c] = {r, c, classes: [], text: ''};

      // Dimension header rows
      if (r <= dimensionHeaderEndRow) {
        cell.isHeader = true;

        // Pivot dimension column headers.
        if (c >= pivotStartCol) {
          let pivotHeaderEntry = pivotHeaderEntries[c - pivotStartCol];
          let {dimensionValues, dimensionNames} = pivotHeaderEntry;
          let dimensionName = dimensionNames[r];
          let dimensionValue = dimensionValues[r];
          cell.classes.push('PivotTable-dimensionHeader', 'PivotTable-pivot');
          if (r === dimensionHeaderEndRow) {
            cell.classes.push('PivotTable-dimensionHeader--lastRow');
          }
          cell.text = formatDimension(dimensionValue, dimensionName);
          cell.dimensions = dimensionValues.slice(0, r + 1).join(',');
          mergeCellWithNeighborIfSame(cell, cells[r][c - 1]);
        }
      } else if (r === metricHeaderRow) {
        // Metric header rows
        cell.isHeader = true;

        // Primary metric column headers.
        if (c >= metricStartCol && c <= metricEndCol) {
          let metric = metricHeaderEntries[c - metricStartCol].name;
          cell.classes.push('PivotTable-metricHeader');
          cell.text = columns.get(metric).uiName;
        } else if (c >= pivotStartCol) {
          // Pivot metric column headers.
          let metric = pivotHeaderEntries[c - pivotStartCol].metric.name;
          cell.classes.push('PivotTable-metricHeader', 'PivotTable-pivot');
          cell.text = columns.get(metric).uiName;
        }
      } else if (r <= resultsEndRow) {
        // Result rows
        let row = rows[r - resultsStartRow];

        // Dimension results.
        if (c <= dimensionEndCol) {
          let dimensionName = dimensions[c];
          let dimensionValue = row.dimensions[c];
          cell.isHeader = true;
          cell.classes.push('PivotTable-dimensionHeader');
          if (c === dimensionEndCol) {
            cell.classes.push('PivotTable-dimensionHeader--lastCol');
          }
          if (r === resultsEndRow) {
            cell.classes.push('PivotTable-dimensionHeader--lastRow');
          }

          cell.text = formatDimension(dimensionValue, dimensionName);
          cell.dimensions = row.dimensions.slice(0, c + 1).join(',');
          mergeCellWithNeighborIfSame(cell, cells[r - 1][c]);
        } else if (c >= metricStartCol && c <= metricEndCol) {
          // Primary metric results.
          let value = row.metrics[0].values[c - metricStartCol];
          let type = metricHeaderEntries[c - metricStartCol].type;
          cell.classes.push('PivotTable-value');
          if (r === resultsEndRow) {
            cell.classes.push('PivotTable-value--lastRow');
          }
          cell.text = formatValue(value, type);
        } else if (c >= pivotStartCol) {
          // Pivot metric results.
          let {values} = row.metrics[0].pivotValueRegions[0];
          let value = values[c - pivotStartCol];
          let type = pivotHeaderEntries[c - pivotStartCol].metric.type;
          cell.classes.push('PivotTable-value', 'PivotTable-pivot');
          if (r === resultsEndRow) {
            cell.classes.push('PivotTable-value--lastRow');
          }
          cell.text = formatValue(value, type);
        }
      } else {
        // Totals row
        // The totals label under the dimension row headers.
        if (c <= dimensionEndCol) {
          cell.isHeader = true;
          cell.text = cell.dimensions = 'Totals';
          cell.classes.push('PivotTable-total');
          if (c > 0) mergeCellWithNeighborIfSame(cell, cells[r][c - 1]);
        } else if (c >= metricStartCol && c <= metricEndCol) {
          // Primary metric totals.
          let value = totals[0].values[c - metricStartCol];
          let type = metricHeaderEntries[c - metricStartCol].type;
          cell.classes.push('PivotTable-total');
          cell.text = formatValue(value, type);
        } else if (c >= pivotStartCol && c <= pivotEndCol) {
          // Pivot metric totals.
          let value = totals[0].pivotValueRegions[0].values[c - pivotStartCol];
          let type = pivotHeaderEntries[c - pivotStartCol].metric.type;
          cell.classes.push('PivotTable-total');
          cell.text = formatValue(value, type);
        }
      }
    }
  }

  return cells;
}


/**
 * A components that renders the pivot table visualization.
 */
export default class PivotTable extends React.Component {

  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /** @return {Object} The React component. */
  render() {
    let {result} = this.props.response;

    if (result) {
      let report = result.reports[0];
      let cells = constructPivotTableCellFromReport(report);

      if (cells) {
        return (
          <div className="PivotTable">
            <table className="PivotTable-table">
              <tbody>
                {cells.map((row, r) => (
                  <tr className="PivotTable-tr" key={r}>
                    {row.map((cell, c) => {
                      if (cell.ref) return undefined;
                      let tag = cell.isHeader ? 'th' : 'td';
                      let props = {key: c};
                      cell.classes.push(`PivotTable-${tag}`);

                      if (cell.colSpan) props.colSpan = cell.colSpan;
                      if (cell.rowSpan) props.rowSpan = cell.rowSpan;

                      props.className = uniq(cell.classes).join(' ');

                      return React.createElement(tag, props, cell.text);
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return <p>No data was returned for this request.</p>;
      }
    } else {
      return null;
    }
  }
}
