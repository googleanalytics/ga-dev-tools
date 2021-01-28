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
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Url } from "../../constants"
import ViewSelector, { HasView } from "../../components/ViewSelector"
import { Info } from "@material-ui/icons"
import useQueryExplorer from "./_useQueryExplorer"
import ConceptMultiSelect from "./_ConceptMultiSelect"

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
  linked: {
    display: "flex",
    alignItems: "baseline",
    "& > a": {
      marginLeft: theme.spacing(1),
    },
  },
  showSegments: {
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(1),
  },
  includeEmpty: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  conceptOption: {
    display: "flex",
    flexDirection: "column",
    "& > p": {
      margin: 0,
      padding: 0,
    },
  },
}))

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

interface LinkedProps {
  hash: string
}

const Linked: React.FC<LinkedProps> = ({ children, hash }) => {
  const classes = useStyles()
  return (
    <div className={classes.linked}>
      {children}
      <a
        href={`https://developers.google.com/analytics/devguides/reporting/core/v3/reference#${hash}`}
        target="_blank"
      >
        <Info />
      </a>
    </div>
  )
}

type SamplingLevel = "DEFAULT" | "FASTER" | "HIGHER_PRECISION"
interface ConceptOption {
  id: string
  name: string
}

export const QueryExplorer = () => {
  const classes = useStyles()
  const [selectedView, setSelectedView] = React.useState<HasView | undefined>(
    undefined
  )
  const { metrics, dimensions } = useQueryExplorer(selectedView)
  const [view, setView] = React.useState("")
  const [startDate, setStartDate] = React.useState("7daysAgo")
  const [endDate, setEndDate] = React.useState("yesterday")
  const [samplingLevel, setSamplingLevel] = React.useState<SamplingLevel>(
    "DEFAULT"
  )
  const [selectedMetrics, setSelectedMetrics] = React.useState<ConceptOption[]>(
    []
  )
  const [selectedDimensions, setSelectedDimensions] = React.useState<
    ConceptOption[]
  >([])

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
        <Linked hash="ids">
          <TextField
            fullWidth
            id="ids"
            label="ids"
            value={view}
            onChange={e => setView(e.target.value)}
            required
            helperText={<>The unique ID used to retrieve the Analytics data.</>}
          />
        </Linked>
        <Linked hash="startDate">
          <TextField
            fullWidth
            id="start-date"
            label="start-date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            helperText={
              <>
                The start of the date range for the data request. Format should
                be YYYY-MM-DD. See {startDateLink} for other allowed values.
              </>
            }
          />
        </Linked>
        <Linked hash="endDate">
          <TextField
            fullWidth
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
        </Linked>
        <Linked hash="metrics">
          <ConceptMultiSelect
            label="Metrics"
            helperText="Metrics to include in the query."
            columns={metrics}
            setSelectedOptions={setSelectedMetrics}
          />
        </Linked>
        <Linked hash="dimensions">
          <ConceptMultiSelect
            label="Dimensions"
            helperText="dimensions to include in the query."
            columns={dimensions}
            setSelectedOptions={setSelectedDimensions}
          />
        </Linked>
        <Linked hash="sort">
          <TextField
            fullWidth
            id="sort"
            label="sort"
            helperText="A list of metrics and dimensions indicating the sorting order and sorting direction for the returned data."
          />
        </Linked>
        <Linked hash="filters">
          <TextField
            id="filters"
            label="filters"
            fullWidth
            helperText="The filters to apply to the query."
          />
        </Linked>
        <Linked hash="segment">
          <TextField
            id="segment"
            label="segment"
            fullWidth
            helperText="The segment to use for the query"
          />
        </Linked>
        <FormControlLabel
          className={classes.showSegments}
          control={<Checkbox />}
          label="Show segment definitions instead of IDs."
        />
        <Linked hash="samplingLevel">
          <FormControl fullWidth>
            <InputLabel>SamplingLevel</InputLabel>
            <Select
              fullWidth
              value={samplingLevel}
              onChange={e => setSamplingLevel((e as any).target.value)}
            >
              <MenuItem value="DEFAULT">Default</MenuItem>
              <MenuItem value="FASTER">Faster</MenuItem>
              <MenuItem value="HIGHER_PRECISION">Higher Precision</MenuItem>
            </Select>
            <FormHelperText>The level of sampling to apply.</FormHelperText>
          </FormControl>
        </Linked>
        <Linked hash="startIndex">
          <TextField
            id="start-index"
            label="start-index"
            fullWidth
            helperText="The start index for the result. Indices are 1-based."
          />
        </Linked>
        <Linked hash="maxResults">
          <TextField
            id="max-results"
            label="max-results"
            fullWidth
            helperText="Maximum number of rows to include in the response."
          />
        </Linked>
        <Linked hash="includeEmptyRows">
          <FormControlLabel
            className={classes.includeEmpty}
            control={<Checkbox />}
            label="Include Empty Rows"
          />
        </Linked>
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
