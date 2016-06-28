import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';



export default class PivotTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pivotTable: [
        {
          'Country': 'india',
          'Sessions': '12',
          'Internet Explorer Sessions': '3',
          'FireFox Sessions': '2',
          'Android Browser Sessions': '4'
        },
        {
          'Country': 'United States',
          'Sessions': '192',
          'Internet Explorer Sessions': '21',
          'FireFox Sessions': '18',
          'Android Browser Sessions': '1'
        },
        {
          'Country': 'United Kingdom',
          'Sessions': '35',
          'Internet Explorer Sessions': '12',
          'FireFox Sessions': '2',
          'Android Browser Sessions': '0'
        }
      ],
      headers: [
        'Country',
        'Sessions',
        'Internet Explorer Sessions',
        'FireFox Sessions',
        'Android Browser Sessions'
      ]
    }
  }

  render() {
    return (
      <Table
        rowsCount={this.state.pivotTable.length}
        rowHeight={50}
        headerHeight={50}
        width={1000}
        height={500}>
        {this.state.headers.map((header) => (
          <Column
            fixed={true}
            header={<Cell>{header}</Cell>}
            cell={props => (
                <Cell {...props}>{this.state.pivotTable[props.rowIndex][header]}</Cell>
              )}
            width={150}
          />
        ))}
      </Table>
    );
  }
}