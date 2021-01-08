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

import Layout from "../../components/layout"
import {
  Typography,
  TextField,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Button,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core"
import { Url } from "../../constants"
import ViewSelector, { HasView } from "../../components/ViewSelector"

const coreReportingApi = <a href={Url.coreReportingApi}>Core Reporting API</a>

const useStyles = makeStyles(theme => ({
  inputs: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  runButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing(1),
  },
}))

const idsLink = (
  <a href="https://developers.google.com/analytics/devguides/reporting/core/v3/reference#ids">
    ids
  </a>
)

const startDateLink = (
  <a href="https://developers.google.com/analytics/devguides/reporting/core/v3/reference#startDate">
    start-date
  </a>
)

const endDateLink = (
  <a href="https://developers.google.com/analytics/devguides/reporting/core/v3/reference#endDate">
    end-date
  </a>
)

export const QueryExplorer = () => {
  const classes = useStyles()
  const [selectedView, setSelectedView] = React.useState<HasView | undefined>(
    undefined
  )
  const [view, setView] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [metrics, setMetrics] = React.useState<string[]>([])

  const requiredParameters = React.useMemo(() => {
    return view !== "" && startDate !== "" && endDate !== ""
  }, [view, startDate, endDate])

  // When the selected view is changed, update the text box for view with the
  // id.
  React.useEffect(() => {
    if (selectedView === undefined) {
      return
    }
    const viewId = `ga:${selectedView.view.id}`
    setView(viewId)
  }, [selectedView])

  return (
    <>
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        Sometimes you just need to explore. This tool lets you play with the{" "}
        {coreReportingApi} by building queries to get data from your Google
        Analytics views (profiles). You can use these queries in any of the
        client libraries to build your own tools.
      </Typography>
      <Typography variant="h3">Select View</Typography>
      <ViewSelector onViewChanged={setSelectedView} />

      <Typography variant="h3">Set query parameters</Typography>
      <section className={classes.inputs}>
        <TextField
          id="ids"
          label="ids"
          value={view}
          onChange={e => setView(e.target.value)}
          required
          helperText={
            <>
              The unique ID used to retrieve the Analytics data. See {idsLink}{" "}
              on devsite.
            </>
          }
        />
        <TextField
          id="start-date"
          label="start-date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
          helperText={
            <>
              The start of the date range for the data request. Format should be
              YYYY-MM-DD. See {startDateLink} for other allowed values.
            </>
          }
        />
        <TextField
          id="end-date"
          label="end-date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
          helperText={
            <>
              The end of the date range for the data request. Format should be
              YYYY-MM-DD. See {endDateLink} for other allowed values.
            </>
          }
        />
        <TextField required id="metrics" label="metrics" />
        <FormControl>
          <InputLabel id="demo-mutiple-chip-label">Metrics</InputLabel>
          <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={metrics}
            onChange={e => {
              setMetrics(e)
            }}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {names.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField id="dimensions" label="dimensions" />
        <TextField id="sort" label="sort" />
        <TextField id="filters" label="filters" />
        <TextField id="segment" label="segment" />
        <FormControlLabel
          control={<Checkbox />}
          label="Show segment defininitions instead of IDs."
        />
        <TextField id="samplingLevel" label="samplingLevel" />
        <TextField id="include-empty-rows" label="include-empty-rows" />
        <TextField id="start-index" label="start-index" />
        <TextField id="max-results" label="max-results" />
        <Button
          disabled={!requiredParameters}
          variant="outlined"
          color="primary"
          className={classes.runButton}
        >
          Run Query
        </Button>
      </section>
    </>
  )
}

const Wrapped = () => {
  return (
    <Layout title="Query Explorer">
      <QueryExplorer />
    </Layout>
  )
}
export default Wrapped
