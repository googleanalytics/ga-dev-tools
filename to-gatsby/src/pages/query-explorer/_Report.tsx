// Copyright 2020 Google Inc. All rights reserved.
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

import * as React from "react"
import {
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core"

const useStyles = makeStyles(_ => ({
  container: {
    maxHeight: 440,
  },
}))

interface ReportProps {
  queryResponse: gapi.client.analytics.GaData | undefined
}

const Report: React.FC<ReportProps> = ({ queryResponse }) => {
  const classes = useStyles()

  if (queryResponse === undefined) {
    return null
  }
  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {queryResponse.columnHeaders?.map(header => (
              <TableCell key={header.name}>{header.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {queryResponse.rows?.map(row => (
            <TableRow>
              {row.map(column => (
                <TableCell>{column}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Report
