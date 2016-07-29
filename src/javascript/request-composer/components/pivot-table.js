import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table-2';


export function createPivotData(report) {
  if (!report.data.rows) {
    return;
  }

  var headers = [];
  var pivotTable = [];

  if (report.columnHeader.dimensions && report.columnHeader.dimensions.length) {

    headers = headers.concat(report.columnHeader.dimensions);
  }

  var metricHeaderEntries = report.columnHeader.metricHeader.metricHeaderEntries;
  for (var i=0, entry; entry = metricHeaderEntries[i]; ++i) {
    headers.push(entry.name);
  }

  if (report.columnHeader.metricHeader.pivotHeaders &&
      report.columnHeader.metricHeader.pivotHeaders.length) {
    var pivotHeader = report.columnHeader.metricHeader.pivotHeaders[0];
    var pivotHeaderEntries = pivotHeader.pivotHeaderEntries;
    for (var i=0, entry; entry = pivotHeaderEntries[i]; ++i) {
      var header = '';
      for (var j=0, dimension; dimension = entry.dimensionNames[j]; ++j) {
        var value = entry.dimensionValues[j];
        header += dimension + '=' + value + ' ';
      }
      header += entry.metric.name;
      headers.push(header);
    }
  }

  if (report.data.rows && report.data.rows.length) {
    for (var rowIndex=0, row; row = report.data.rows[rowIndex]; ++rowIndex) {
      var pivotTableRow = {};
      var headerIndex = 0;
      for (var i=0, value; value = row.dimensions[i]; ++i) {
        pivotTableRow[headers[headerIndex]] = value;
        headerIndex += 1;
      }
      var metricValues = row.metrics[0].values;
      for (var i=0, value; value = metricValues[i]; ++i) {
        pivotTableRow[headers[headerIndex]] = value;
        headerIndex += 1;
      }
      if (row.metrics[0].pivotValueRegions &&
          row.metrics[0].pivotValueRegions.length) {
        var pivotValues = row.metrics[0].pivotValueRegions[0].values;
        for (var i=0, value; value = pivotValues[i]; ++i) {
          pivotTableRow[headers[headerIndex]] = value;
          headerIndex += 1;
        }
      }
      pivotTable.push(pivotTableRow);
    }
  }

  return {
      pivotTable: pivotTable,
      headers: headers
  };
};

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

export default class PivotTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let {response} = this.props;

    let data = createPivotData(response.result.reports[0]);

    if (data) {
      return (
        <Table
          rowsCount={data.pivotTable.length}
          rowHeight={50}
          headerHeight={100}
          width={1000}
          height={500}>
          {data.headers.map((header) => (
            <Column
              fixed={true}
              header={<Cell>{header}</Cell>}
              key={header}
              cell={<TextCell data={data.pivotTable} col={header} />}
              width={150}
            />
          ))}
        </Table>
      );
    } else {
      return (
          <h2>No data in response</h2>
      );
    }
  }
}