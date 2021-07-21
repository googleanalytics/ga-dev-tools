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
  TextField,
} from "@material-ui/core"
import Spinner from "../../components/Spinner"
import { CopyIconButton } from "../../components/CopyButton"
import { QueryResponse, APIStatus } from "./hooks"
import TSVDownload from "./TSVDownload"

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

const ReportTable: React.FC<{
  queryResponse: gapi.client.analytics.GaData
}> = ({ queryResponse }) => {
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
  queryResponse: QueryResponse
}

const Report: React.FC<ReportProps> = ({ queryResponse }) => {
  const classes = useStyles()
  if (queryResponse === undefined) {
    return null
  }

  if (queryResponse.status === APIStatus.InProgress) {
    return <Spinner>Loading results &hellip;</Spinner>
  }

  if (queryResponse.status === APIStatus.Error) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.preamble}>
          An error has occured
        </Typography>
        <section className={classes.preamble}>
          <Typography>Error code: {queryResponse.error.code}</Typography>
          <Typography>Error message: {queryResponse.error.message}</Typography>
        </section>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.preamble}>
        {queryResponse.response.profileInfo?.profileName}
      </Typography>
      <section className={classes.preamble}>
        <Typography>
          Showing <strong>{queryResponse.response.rows?.length}</strong> out of{" "}
          <strong>{queryResponse.response.totalResults}</strong> total results.
        </Typography>
        <Typography>
          {queryResponse.response.containsSampledData ? (
            <>Contains sampled data.</>
          ) : (
            <>Does not contain sampled data.</>
          )}
        </Typography>
        <TextField
          value={queryResponse.response.selfLink}
          variant="outlined"
          fullWidth
          multiline
          InputProps={{
            endAdornment: (
              <CopyIconButton
                toCopy={queryResponse.response.selfLink || ""}
                tooltipText="Copy API request."
              />
            ),
          }}
        />

        <TSVDownload queryResponse={queryResponse.response} />
      </section>
      <ReportTable queryResponse={queryResponse.response} />
    </Paper>
  )
}

export default Report
