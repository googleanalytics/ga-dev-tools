import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table-2';


export function createCohortData(report, settings) {
  if (!report.data) {
    return;
  }

  let headers = ['Cohort'];
  let cohortTable = [];
  let cohortRows = [];

    switch(settings.responseCohortSize) {
      case 'Day':
        // Create cohorts for the past seven days.
        for(let i = 0; i < 7; i++) {
          headers.push('Day ' + i);
        }
        break;
      case 'Week':
        // Create cohorts for the past 6 weeks.
        for(let i = 0; i < 6; i++) {
          headers.push('Week ' + i);
        }
        break;
      case 'Month':
        // Create cohorts for the past 3 months.
        for(let i = 0; i < 3; i++) {
          headers.push('Month ' + i);
        }
        break;
    }

  if (report.data.rows && report.data.rows.length) {
    for (let row of report.data.rows) {
      if (row.dimensions && row.dimensions.length == 2) {
        let rowKey = row.dimensions[0];
        let valueKey = settings.responseCohortSize + ' ' +
          Number(row.dimensions[1]);
        if (cohortRows.indexOf(rowKey) == -1) {
          cohortRows.push(rowKey);
          cohortTable.push({'Cohort': rowKey});
        }
        cohortTable[cohortTable.length-1][valueKey] = row.metrics[0].values[0];
      }
    }
  }

  return {
      cohortTable: cohortTable,
      headers: headers,
  };
}

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

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
            header={<Cell>{header}</Cell>}
            width={200}
            key={header}
            cell={<TextCell data={data.cohortTable} col={header} />}
          />
        ))}
      </Table>
    );
  }
}