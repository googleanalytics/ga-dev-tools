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

import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Launch from "@material-ui/icons/Launch"

import useDataAPIRequest from "./useDataAPIRequest"
import useInputs from "./useInputs"
import { StorageKey, Url } from "@/constants"
import ViewSelector from "@/components/ViewSelector"
import {
  DimensionsPicker,
  MetricsPicker,
  SegmentPicker,
  V3SamplingLevelPicker,
} from "@/components/UAPickers"
import { PAB } from "@/components/Buttons"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import ExternalLink from "@/components/ExternalLink"
import Sort from "./Sort"
import Report from "./Report"
import usePermalink from "./usePermalink"
import { Column, ProfileSummary } from "@/types/ua"
import useUADimensionsAndMetrics, {
  UADimensionsAndMetricsRequestCtx,
} from "../UAPickers/useDimensionsAndMetrics"
import { UASegmentsRequestCtx, useUASegments } from "../UAPickers/useUASegments"
import useAccountPropertyView from "../ViewSelector/useAccountPropertyView"
import { useHydratedPersistantString } from "@/hooks/useHydrated"
import { successful } from "@/types"

const coreReportingApi = (
  <ExternalLink href={Url.coreReportingApi}>Core Reporting API</ExternalLink>
)

const useStyles = makeStyles(theme => ({
  inputs: {
    maxWidth: "500px",
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
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
  <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v3/reference#startDate">
    start-date
  </ExternalLink>
)

const endDateLink = (
  <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v3/reference#endDate">
    end-date
  </ExternalLink>
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

export enum QueryParam {
  Account = "a",
  Property = "b",
  View = "c",
  ShowSegmentDefinitions = "d",
  ViewID = "ids",
  StartDate = "start-date",
  EndDate = "end-date",
  SelectedMetrics = "metrics",
  SelectedDimensions = "dimensions",
  Sort = "sort",
  Filters = "filters",
  Segment = "segment",
  SamplingLevel = "samplingLevel",
  StartIndex = "start-index",
  MaxResults = "max-results",
  IncludeEmptyRows = "include-empty-rows",
}

export const QueryExplorer = () => {
  const classes = useStyles()

  const [viewID, setViewID] = useHydratedPersistantString(
    StorageKey.queryExplorerViewID,
    QueryParam.ViewID
  )

  const onSetView = React.useCallback(
    (view: ProfileSummary | undefined) => {
      if (view === undefined) {
        return
      }
      setViewID(`ga:${view.id}`)
    },
    [setViewID]
  )

  const accountPropertyView = useAccountPropertyView(
    StorageKey.queryExplorerAPV,
    QueryParam,
    onSetView
  )
  const uaDimensionsAndMetricsRequest = useUADimensionsAndMetrics(
    accountPropertyView
  )
  const uaSegmentsRequest = useUASegments()
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedMetrics,
    setSelectedMetricIDs,
    selectedDimensions,
    setSelectedDimensionIDs,
    setSortIDs,
    filters,
    setFilters,
    setSegmentID,
    showSegmentDefinition,
    setShowSegmentDefiniton,
    samplingValue,
    setSamplingValue,
    startIndex,
    setStartIndex,
    maxResults,
    setMaxResults,
    includeEmptyRows,
    setIncludeEmptyRows,
    segment,
    sort,
  } = useInputs(uaDimensionsAndMetricsRequest, uaSegmentsRequest)
  const { account, property, view } = accountPropertyView

  const {
    runQuery,
    requiredParameters,
    queryResponse,
    accessToken,
  } = useDataAPIRequest({
    viewID,
    startDate,
    endDate,
    selectedMetrics,
    selectedDimensions,
    includeEmptyRows,
    samplingValue,
    segment,
    startIndex,
    maxResults,
    filters,
    sort,
  })

  const permalink = usePermalink({
    account,
    property,
    view,
    viewID,
    startDate,
    endDate,
    selectedMetrics,
    selectedDimensions,
    sort,
    filters,
    segment,
    showSegmentDefinition,
    startIndex,
    maxResults,
    includeEmptyRows,
  })

  const [updateLink, setUpdateLink] = React.useState(false)
  const [currentLink, setCurrentLink] = React.useState<string>()
  React.useEffect(() => {
    if (updateLink) {
      setCurrentLink(permalink)
      setUpdateLink(false)
    }
  }, [permalink, updateLink])

  return (
    <UADimensionsAndMetricsRequestCtx.Provider
      value={uaDimensionsAndMetricsRequest}
    >
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        This tool lets you interact with the {coreReportingApi} by building
        queries to get data from your Google Analytics views (profiles). You can
        use these queries in any of the client libraries to build your own
        tools.
      </Typography>
      <Typography variant="h3">Select View</Typography>
      <ViewSelector
        {...accountPropertyView}
        autoFill
        className={classes.viewSelector}
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
          value={viewID || ""}
          onChange={e => setViewID(e.target.value)}
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
          value={startDate || ""}
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
          value={endDate || ""}
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
          selectedMetrics={selectedMetrics}
          setMetricIDs={setSelectedMetricIDs}
          helperText="Metrics to include in the query."
        />
        <DimensionsPicker
          selectedDimensions={selectedDimensions}
          setDimensionIDs={setSelectedDimensionIDs}
          helperText="Dimensions to include in the query."
        />
        <Sort
          columns={(selectedDimensions || []).concat(selectedMetrics || [])}
          sort={sort}
          setSortIDs={setSortIDs}
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
        <UASegmentsRequestCtx.Provider value={uaSegmentsRequest}>
          <SegmentPicker
            segment={segment}
            setSegmentID={setSegmentID}
            showSegmentDefinition={showSegmentDefinition}
          />
        </UASegmentsRequestCtx.Provider>
        <LabeledCheckbox
          checked={showSegmentDefinition}
          setChecked={setShowSegmentDefiniton}
          className={classes.showSegments}
        >
          Show segment definitions instead of IDs.
        </LabeledCheckbox>
        <V3SamplingLevelPicker
          samplingLevel={samplingValue}
          setSamplingLevel={setSamplingValue}
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
        <PAB
          disabled={!requiredParameters}
          className={classes.runButton}
          onClick={() =>
            runQuery(() => {
              setUpdateLink(true)
            })
          }
        >
          Run Query
        </PAB>
        <LabeledCheckbox
          checked={includeEmptyRows}
          setChecked={setIncludeEmptyRows}
          className={classes.includeEmpty}
        >
          include empty rows
        </LabeledCheckbox>
      </section>
      <Report
        accessToken={accessToken}
        queryResponse={queryResponse}
        columns={successful(uaDimensionsAndMetricsRequest)?.columns}
        permalink={currentLink}
      />
    </UADimensionsAndMetricsRequestCtx.Provider>
  )
}

export default QueryExplorer
