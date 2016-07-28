import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';


export function createCohortData(report, settings) {
  if (!report.data) {
    return;
  }

  var headers = ['Cohort'];
  var cohortTable = [];
  var cohortRows = [];

    switch(settings.responseCohortSize) {
      case 'Day':
        // Create cohorts for the past seven days.
        for(var i = 0; i < 7; i++) {
          headers.push('Day ' + i);
        }
        break;
      case 'Week':
        // Create cohorts for the past 6 weeks.
        for(var i = 0; i < 6; i++) {
          headers.push('Week ' + i);
        }
        break;
      case 'Month':
        // Create cohorts for the past 3 months.
        for(var i = 0; i < 3; i++) {
          headers.push('Month ' + i);
        }
        break;
    }

  if (report.data.rows && report.data.rows.length) {
    for (var rowIndex=0, row; row = report.data.rows[rowIndex]; ++rowIndex) {
      if (row.dimensions && row.dimensions.length == 2) {
        var cohortRowKey = row.dimensions[0];
        var cohortValueKey = settings.responseCohortSize + ' ' + Number(row.dimensions[1]);
        if (cohortRows.indexOf(cohortRowKey) == -1) {
          cohortRows.push(cohortRowKey);
          cohortTable.push({'Cohort': cohortRowKey});
        }
        cohortTable[cohortTable.length-1][cohortValueKey] = row.metrics[0].values[0];
      }
    }
  }

  console.log(cohortTable);

  return {
      cohortTable: cohortTable,
      headers: headers,
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
        headerHeight={50}
        width={1000}
        height={500}>
        {data.headers.map((header) => (
          <Column
            fixed={true}
            header={<Cell>{header}</Cell>}
            width={200}
            cell={props => (
                <Cell key={props.rowIndex} {...props}>{data.cohortTable[props.rowIndex][header]}</Cell>
              )}
          />
        ))}
      </Table>
    );
  }
}