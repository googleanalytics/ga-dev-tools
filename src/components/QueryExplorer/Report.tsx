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
import { QueryResponse, APIStatus } from "./useDataAPIRequest"
import TSVDownload from "./TSVDownload"
import LabeledCheckbox from "../LabeledCheckbox"
import { useState } from "react"

const useStyles = makeStyles(theme => ({
  paper: {},
  preamble: {
    padding: theme.spacing(2, 2, 0, 2),
    margin: "unset",
  },
  container: {
    maxHeight: 440,
  },
  breakAll: {
    wordBreak: "break-all",
  },
  reportLink: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const ReportTable: React.FC<{
  queryResponse: gapi.client.analytics.GaData
  columns: gapi.client.analytics.Column[] | undefined
}> = ({ queryResponse, columns }) => {
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
              <TableCell key={header.name}>
                {columns?.find(c => c.id === header.name)?.attributes?.uiName ||
                  header.name}
              </TableCell>
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
  columns: gapi.client.analytics.Column[] | undefined
  permalink: string | undefined
  accessToken: string | undefined
}

const Report: React.FC<ReportProps> = ({
  queryResponse,
  columns,
  permalink,
  accessToken,
}) => {
  const classes = useStyles()
  const [includeAccessToken, setIncludeAccessToken] = useState(false)

  const requestURL = React.useMemo(() => {
    if (
      queryResponse === undefined ||
      queryResponse.status !== APIStatus.Success
    ) {
      return undefined
    }
    const [base, queryParamString] = queryResponse.response.selfLink!.split("?")
    const existingQueryParams = new URLSearchParams(queryParamString)
    const nuQueryParams = new URLSearchParams()
    if (includeAccessToken && accessToken !== undefined) {
      nuQueryParams.append("access_token", accessToken)
    }
    existingQueryParams.forEach((value, key) => {
      nuQueryParams.append(key, value)
    })
    return `${base}?${nuQueryParams.toString()}`
  }, [queryResponse, includeAccessToken, accessToken])

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

        <TSVDownload queryResponse={queryResponse.response} />
        <TextField
          className={classes.breakAll}
          value={requestURL || ""}
          variant="outlined"
          fullWidth
          multiline
          label="API Request"
          InputProps={{
            endAdornment: (
              <CopyIconButton
                toCopy={requestURL || ""}
                tooltipText="Copy API request."
              />
            ),
          }}
        />
        <LabeledCheckbox
          checked={includeAccessToken}
          setChecked={setIncludeAccessToken}
        >
          include access token
        </LabeledCheckbox>
        <section className={classes.reportLink}>
          <a href={permalink}>Link to this report</a>
        </section>
      </section>
      <ReportTable queryResponse={queryResponse.response} columns={columns} />
    </Paper>
  )
}

export default Report
