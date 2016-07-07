import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';


export function createCohortData(report, settings) {
  if (!report.data) {
    return;
  }

  var headers = [];
  var cohortTable = [];

    switch(settings.responseCohortSize) {
      case 'Day':
        // Create cohorts for the past seven days.
        for(var i = 0; i < 7; i++) {
          headers.push('Day ' + i);
        }
        for(var i = 0; i < 7; i++) {
          var cohortRow = {};
          for (var j = 0, header; header = headers[j]; ++j) {
            cohortRow[header] = Math.floor(Math.random() * (100 - 0)) + 0;
          }
          cohortTable.push(cohortRow);
        }
        break;
      case 'Week':
        // Create cohorts for the past 6 weeks.
        for(var i = 0; i < 6; i++) {
          headers.push('Week ' + i);
        }
        for(var i = 0; i < 6; i++) {
          var cohortRow = {};
          for (var j = 0, header; header = headers[j]; ++j) {
            cohortRow[header] = Math.floor(Math.random() * (100 - 0)) + 0;
          }
          cohortTable.push(cohortRow);
        }
        break;
      case 'Month':
        // Create cohorts for the past 3 months.
        for(var i = 0; i < 3; i++) {
          headers.push('Month ' + i);
        }
        for(var i = 0; i < 7; i++) {
          var cohortRow = {};
          for (var j = 0, header; header = headers[j]; ++j) {
            cohortRow[header] = Math.floor(Math.random() * (100 - 0)) + 0;
          }
          cohortTable.push(cohortRow);
        }
        break;
    }

for (var j = 0, header; header = headers[j]; ++j) {

}

  return {
      cohortTable: cohortTable,
      headers: headers
  };
};



export default class CohortTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let {response, settings} = this.props;

    let data = createCohortData(response.result.reports[0], settings);

    return (
      <Table
        rowsCount={data.cohortTable.length}
        rowHeight={50}
        headerHeight={100}
        width={1000}
        height={500}>
        {data.headers.map((header) => (
          <Column
            fixed={true}
            header={<Cell>{header}</Cell>}
            cell={props => (
                <Cell {...props}>{data.cohortTable[props.rowIndex][header]}</Cell>
              )}
            width={150}
          />
        ))}
      </Table>
    );
  }
}