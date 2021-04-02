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
  Tooltip,
} from "@material-ui/core"
import { Url, StorageKey } from "../../constants"
import ViewSelector, { HasView } from "../../components/ViewSelector"
import { Launch } from "@material-ui/icons"
import Sort from "./_Sort"
import Report from "./_Report"
import { Column, useApi, Segment } from "../../api"
import {
  DimensionsPicker,
  MetricsPicker,
  SegmentPicker,
  V3SamplingLevel,
  V3SamplingLevelPicker,
} from "../../components/UAPickers"
import { usePersistentBoolean } from "../../hooks"

const coreReportingApi = <a href={Url.coreReportingApi}>Core Reporting API</a>

const useStyles = makeStyles(theme => ({
  inputs: {
    maxWidth: "500px",
    marginBottom: theme.spacing(1),
  },
  runButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing(1),
  },
  externalReference: {
    "&:hover": {
      opacity: 1.0,
    },
    opacity: 0.3,
  },
  viewSelector: {
    maxWidth: "500px",
  },
  showSegments: {
    marginLeft: theme.spacing(1),
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

export type SortableColumn = Column & { sort: "ASCENDING" | "DESCENDING" }

const DevsiteLink: React.FC<{ hash: string }> = ({ hash }) => {
  const classes = useStyles()
  return (
    <Tooltip title={`See ${hash} on devsite.`}>
      <a
        className={classes.externalReference}
        href={`https://developers.google.com/analytics/devguides/reporting/core/v3/reference#${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        <Launch color="action" />
      </a>
    </Tooltip>
  )
}

export const QueryExplorer = () => {
  const classes = useStyles()
  const [selectedView, setSelectedView] = React.useState<HasView | undefined>(
    undefined
  )
  const [sort, setSort] = React.useState<SortableColumn[] | undefined>(
    undefined
  )
  const api = useApi()
  const [view, setView] = React.useState("")
  const [startDate, setStartDate] = React.useState("7daysAgo")
  const [endDate, setEndDate] = React.useState("yesterday")
  const [startIndex, setStartIndex] = React.useState<string>()
  const [maxResults, setMaxResults] = React.useState<string>()
  // TODO - Improve filters with a filter builder that helps to create valid
  // filters. It's currently very easy to create in invalid filter such as
  //
  // ga:sessionCount>10
  //
  // This doesn't work since sessionCount is a dimension.
  const [filters, setFilters] = React.useState<string>()
  const [selectedSegment, setSelectedSegment] = React.useState<Segment>()
  const [selectedMetrics, setSelectedMetrics] = React.useState<Column[]>()
  const [selectedDimensions, setSelectedDimensions] = React.useState<Column[]>()
  const [includeEmptyRows, setIncludeEmptyRows] = React.useState(true)
  const [showSegmentDefinition, setShowSegmentDefiniton] = usePersistentBoolean(
    StorageKey.queryExplorerShowSegmentDefinition,
    false
  )
  const [queryResponse, setQueryResponse] = React.useState<
    gapi.client.analytics.GaData
  >()
  const [selectedSamplingValue, setSelectedSamplingValue] = React.useState<
    V3SamplingLevel | undefined
  >(V3SamplingLevel.Default)

  const requiredParameters = React.useMemo(() => {
    return (
      view !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      selectedMetrics !== undefined &&
      selectedMetrics.length !== 0
    )
  }, [view, startDate, endDate, selectedMetrics])

  // When the selected view is changed, update the text box for view with the
  // id.
  React.useEffect(() => {
    if (selectedView === undefined) {
      return
    }
    const viewId = `ga:${selectedView.view.id}`
    setView(viewId)
  }, [selectedView])

  // TODO - Add error handling and visual indication when an error happens.
  const runQuery = React.useCallback(() => {
    if (
      api === undefined ||
      selectedMetrics === undefined ||
      selectedMetrics.length === 0
    ) {
      return
    }
    const metrics = selectedMetrics.map(a => a.id).join(",")
    const dimensions =
      selectedDimensions?.length === 0
        ? undefined
        : selectedDimensions?.map(a => a.id).join(",")

    const apiObject = {
      ids: view,
      "start-date": startDate,
      "end-date": endDate,
      "include-empty-rows": includeEmptyRows,
      samplingLevel: selectedSamplingValue,
      metrics,
      dimensions,
    }
    if (selectedSegment !== undefined) {
      apiObject["segment"] = selectedSegment.segmentId
    }
    if (startIndex !== undefined && startIndex !== "") {
      apiObject["start-index"] = startIndex
    }
    if (maxResults !== undefined && maxResults !== "") {
      apiObject["max-results"] = maxResults
    }
    if (filters !== undefined && filters !== "") {
      apiObject["filters"] = encodeURI(filters)
    }
    if (sort !== undefined) {
      apiObject["sort"] = sort
        .map(a => `${a.sort === "ASCENDING" ? "" : "-"}${a.id}`)
        .join(",")
    }
    // TODO - add in a loading indicator since this can take a while.
    api.data.ga
      .get(apiObject)
      .then(response => {
        setQueryResponse(response.result)
      })
      .catch(e => console.error(e))
  }, [
    view,
    startDate,
    endDate,
    selectedDimensions,
    selectedMetrics,
    selectedSegment,
    sort,
    startIndex,
    maxResults,
    filters,
    selectedSamplingValue,
    includeEmptyRows,
    api,
  ])

  const onViewChanged = React.useCallback(view => {
    if ([view.view, view.account, view.property].every(a => a !== undefined)) {
      setSelectedView(view as HasView)
    }
  }, [])

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
      <ViewSelector
        className={classes.viewSelector}
        onViewChanged={onViewChanged}
        vertical
        size="small"
        variant="outlined"
      />

      <Typography variant="h3">Set query parameters</Typography>
      <section className={classes.inputs}>
        <TextField
          InputProps={{
            endAdornment: <DevsiteLink hash="ids" />,
          }}
          size="small"
          variant="outlined"
          fullWidth
          id="ids"
          label="ids"
          value={view}
          onChange={e => setView(e.target.value)}
          required
          helperText={<>The unique ID used to retrieve the Analytics data.</>}
        />
        <TextField
          InputProps={{
            endAdornment: <DevsiteLink hash="startDate" />,
          }}
          size="small"
          variant="outlined"
          fullWidth
          id="start-date"
          label="start date"
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
          InputProps={{
            endAdornment: <DevsiteLink hash="endDate" />,
          }}
          fullWidth
          size="small"
          variant="outlined"
          id="end-date"
          label="end date"
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
        <MetricsPicker
          required
          setMetrics={setSelectedMetrics}
          helperText="metrics to include in the query."
          storageKey={StorageKey.queryExplorerMetrics}
        />
        <DimensionsPicker
          setDimensions={setSelectedDimensions}
          helperText="dimensions to include in the query."
          storageKey={StorageKey.queryExplorerDimensions}
        />
        <Sort
          columns={(selectedDimensions || []).concat(selectedMetrics || [])}
          setSort={setSort}
        />
        <TextField
          InputProps={{
            endAdornment: <DevsiteLink hash="filters" />,
          }}
          value={filters || ""}
          onChange={e => setFilters(e.target.value)}
          size="small"
          variant="outlined"
          id="filters"
          label="filters"
          fullWidth
          helperText="The filters to apply to the query."
        />
        <SegmentPicker
          storageKey={StorageKey.queryExplorerSegment}
          setSegment={setSelectedSegment}
          showSegmentDefinition={showSegmentDefinition}
        />
        <FormControlLabel
          className={classes.showSegments}
          control={
            <Checkbox
              checked={showSegmentDefinition}
              onChange={e => {
                setShowSegmentDefiniton(e.target.checked)
              }}
            />
          }
          label="Show segment definitions instead of IDs."
        />
        <V3SamplingLevelPicker
          storageKey={StorageKey.queyExplorerSamplingLevel}
          setSamplingLevel={setSelectedSamplingValue}
          helperText="The sampling level to use for the query."
        />
        <TextField
          InputProps={{
            endAdornment: <DevsiteLink hash="startIndex" />,
          }}
          size="small"
          variant="outlined"
          id="start-index"
          label="start index"
          fullWidth
          helperText="The start index for the result. Indices are 1-based."
          value={startIndex || ""}
          onChange={e => setStartIndex(e.target.value)}
        />
        <TextField
          InputProps={{
            endAdornment: <DevsiteLink hash="maxResults" />,
          }}
          size="small"
          variant="outlined"
          id="max-results"
          label="max results"
          fullWidth
          helperText="Maximum number of rows to include in the response."
          value={maxResults || ""}
          onChange={e => setMaxResults(e.target.value)}
        />
        <FormControlLabel
          className={classes.includeEmpty}
          control={
            <Checkbox
              checked={includeEmptyRows}
              onChange={e => setIncludeEmptyRows(e.target.checked)}
            />
          }
          label="Include Empty Rows"
        />
        <Button
          disabled={!requiredParameters}
          variant="outlined"
          color="primary"
          className={classes.runButton}
          onClick={runQuery}
        >
          Run Query
        </Button>
      </section>
      <Report queryResponse={queryResponse} />
    </>
  )
}

const Wrapped = ({ location: { pathname } }) => {
  return (
    <Layout title="Query Explorer" requireLogin pathname={pathname}>
      <QueryExplorer />
    </Layout>
  )
}
export default Wrapped
