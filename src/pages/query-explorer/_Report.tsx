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
  Paper,
  Typography,
} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  paper: {},
  preamble: {
    padding: theme.spacing(2, 2, 0, 2),
    margin: "unset",
  },
  container: {
    maxHeight: 440,
  },
}))

const ReportTable: React.FC<ReportProps> = ({ queryResponse }) => {
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
          {queryResponse.rows?.map((row, idx) => (
            <TableRow key={`row-${idx}`}>
              {row.map((column, innerIdx) => (
                <TableCell key={`row-${idx} column-${innerIdx}`}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface ReportProps {
  queryResponse: gapi.client.analytics.GaData | undefined
}

const Report: React.FC<ReportProps> = ({ queryResponse }) => {
  const classes = useStyles()
  if (queryResponse === undefined) {
    return null
  }
  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.preamble}>
        {queryResponse.profileInfo?.profileName}
      </Typography>
      <section className={classes.preamble}>
        <Typography>
          Showing <strong>{queryResponse.rows?.length}</strong> out of{" "}
          <strong>{queryResponse.totalResults}</strong> total results.
        </Typography>
        <Typography>
          {queryResponse.containsSampledData ? (
            <>Contains sampled data.</>
          ) : (
            <>Does not contain sampled data.</>
          )}
        </Typography>
        <Typography>{queryResponse.selfLink}</Typography>
      </section>
      <ReportTable queryResponse={queryResponse} />
    </Paper>
  )
}

export default Report
