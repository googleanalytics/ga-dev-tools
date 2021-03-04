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
import ExternalLink from "../../components/ExternalLink"
import {
  TextField,
  Button,
  TableContainer,
  Table,
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  useTheme,
} from "@material-ui/core"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"

import { HasView } from "../../components/ViewSelector"
import GADate from "../../components/GADate"
import {
  GetReportsResponse,
  Column,
  useAnalyticsReportingAPI,
  useDimensionsAndMetrics,
  Segment,
} from "./_api"
import SelectMultiple from "../../components/SelectMultiple"
import { StorageKey } from "../../constants"
import { FancyOption } from "../../components/FancyOption"
import { useState, useMemo, useEffect } from "react"
import { useSegments } from "../../api"
import SelectSingle from "../../components/SelectSingle"

enum SamplingLevel {
  Default = "DEFAULT",
  SMALL = "SMALL",
  LARGE = "LARGE",
}

const useStyles = makeStyles(theme => ({
  loadingIndicator: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    maxHeight: 440,
  },
  reports: {
    marginTop: theme.spacing(2),
  },
}))

const ReportTable: React.FC<{ response: GetReportsResponse | undefined }> = ({
  response,
}) => {
  const classes = useStyles()

  if (response === undefined) {
    return null
  }
  return (
    <section className={classes.reports}>
      {response.reports?.map((reportData, reportIdx) => {
        return (
          <TableContainer key={reportIdx} className={classes.container}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportData.columnHeader?.dimensions?.map(header => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                  {reportData.columnHeader?.metricHeader?.metricHeaderEntries?.map(
                    header => (
                      <TableCell key={header.name}>{header.name}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.data?.rows?.map((row, idx) => (
                  <TableRow key={`row-${idx}`}>
                    {row.dimensions?.map((column, innerIdx) => (
                      <TableCell key={`row-${idx} column-${innerIdx}`}>
                        {column}
                      </TableCell>
                    ))}
                    {row?.metrics?.flatMap(({ values: dateRange }) =>
                      dateRange?.map((column, innerIdx) => (
                        <TableCell key={`row-${idx} column-${innerIdx}`}>
                          {column}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      })}
    </section>
  )
}

const linkFor = (hash: string) =>
  `https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#${hash}`

const titleFor = (id: string) => `See ${id} on devsite.`

interface HistogramRequestProps {
  view: HasView | undefined
}

const useHistogramRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<Column[]>([])
  const [samplingLevel, setSamplingLevel] = useState<SamplingLevel>()

  const [startDate, setStartDate] = useState(() => {
    const startDate = window.localStorage.getItem(StorageKey.histogramStartDate)
    return startDate || "7daysAgo"
  })
  // Keep the startDate value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(StorageKey.histogramStartDate, startDate)
  }, [startDate])

  const [endDate, setEndDate] = useState(() => {
    const endDate = window.localStorage.getItem(StorageKey.histogramEndDate)
    return endDate || "yesterday"
  })
  // Keep the endDate value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(StorageKey.histogramEndDate, endDate)
  }, [endDate])

  const [buckets, setBuckets] = useState(() => {
    const buckets = window.localStorage.getItem(StorageKey.histogramBuckets)
    return buckets || ""
  })
  // Keep the histogram bucket value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(StorageKey.histogramBuckets, buckets)
  }, [buckets])

  const [filtersExpression, setFiltersExpression] = useState(() => {
    const filtersExpression = window.localStorage.getItem(
      StorageKey.histogramFiltersExpression
    )
    return filtersExpression || ""
  })
  // Keep the histogram filters expression value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(
      StorageKey.histogramFiltersExpression,
      filtersExpression
    )
  }, [filtersExpression])

  const [selectedSegment, setSelectedSegment] = useState<Segment>()

  useMemo(() => {
    const id = view?.view.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [view])

  return {
    viewId,
    setViewId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedDimensions,
    setSelectedDimensions,
    selectedMetrics,
    setSelectedMetrics,
    buckets,
    setBuckets,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
  }
}

const useHistogramRequestObject = ({
  selectedMetrics,
  selectedDimensions,
  buckets,
  viewId,
  startDate,
  endDate,
  filtersExpression,
  selectedSegment,
  samplingLevel,
}: {
  selectedMetrics: Column[]
  selectedDimensions: Column[]
  buckets: string
  viewId: string
  startDate: string
  endDate: string
  filtersExpression: string
  selectedSegment: Segment | undefined
  samplingLevel: SamplingLevel | undefined
}) => {
  const histogramRequestObject = useMemo(() => {
    if (viewId === undefined) {
      return undefined
    }
    const optionalParameters = {}
    if (selectedMetrics.length > 0) {
      optionalParameters["metrics"] = selectedMetrics.map(column => ({
        expression: column.id,
      }))
    }
    if (selectedDimensions.length > 0) {
      optionalParameters["dimensions"] = selectedDimensions.map(column => ({
        histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)),
        name: column.id,
      }))
    }
    if (filtersExpression !== "") {
      optionalParameters["filtersExpression"] = filtersExpression
    }
    if (selectedSegment !== undefined) {
      optionalParameters["segments"] = [
        { segmentId: selectedSegment.segmentId },
      ]
      optionalParameters["dimensions"] = [
        {
          histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)),
          name: "ga:segment",
        },
      ].concat(optionalParameters["dimensions"] || [])
    }
    if (samplingLevel !== undefined) {
      optionalParameters["samplingLevel"] = samplingLevel
    }

    return {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          ...optionalParameters,
        },
      ],
    }
  }, [
    selectedMetrics,
    buckets,
    selectedDimensions,
    viewId,
    startDate,
    endDate,
    filtersExpression,
    selectedSegment,
  ])

  return histogramRequestObject
}

const HistogramRequest: React.FC<HistogramRequestProps> = ({ view }) => {
  const classes = useStyles()
  const reportingAPI = useAnalyticsReportingAPI()
  const {
    viewId,
    setViewId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedDimensions,
    setSelectedDimensions,
    selectedMetrics,
    setSelectedMetrics,
    buckets,
    setBuckets,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
  } = useHistogramRequestParameters(view)
  const requestObject = useHistogramRequestObject({
    viewId,
    startDate,
    endDate,
    selectedDimensions,
    selectedMetrics,
    buckets,
    filtersExpression,
    selectedSegment,
    samplingLevel,
  })
  const { dimensions, metrics } = useDimensionsAndMetrics()
  const segments = useSegments()

  const [reportsResponse, setReportsResponse] = useState<GetReportsResponse>()
  const [longRequest, setLongRequest] = useState(false)
  const theme = useTheme()

  const makeRequest = React.useCallback(() => {
    if (reportingAPI === undefined || requestObject === undefined) {
      return
    }
    ;(async () => {
      const first = await Promise.race<string>([
        (async () => {
          const response = await reportingAPI.reports.batchGet(
            {},
            requestObject
          )
          setReportsResponse(response.result)
          // TODO - this could be more nuianced, but this is good enough for
          // now. This makes it where for requests that take longer than 300ms,
          // the loader shows up for at least 500ms so it's not as jumpy.
          setTimeout(() => {
            setLongRequest(false)
          }, 500)
          return "API"
        })(),
        new Promise<string>(resolve => {
          window.setTimeout(() => {
            resolve("TIMEOUT")
          }, 300)
        }),
      ])
      if (first === "TIMEOUT") {
        setLongRequest(true)
      }
    })()
  }, [reportingAPI, requestObject])

  return (
    <>
      <TextField
        InputProps={{
          endAdornment: (
            <ExternalLink
              href={linkFor("ReportRequest.FIELDS.view_id")}
              title={titleFor("viewId")}
            />
          ),
        }}
        size="small"
        variant="outlined"
        fullWidth
        label="viewId"
        value={viewId}
        onChange={e => setViewId(e.target.value)}
        required
        helperText="The analytics view ID from which to retrieve data."
      />
      <GADate
        initialValue={startDate}
        onDateChanged={setStartDate}
        href="https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS.date_ranges"
        title="see dateRanges on Devsite."
        label="startDate"
        helperText="The start of the date range for the data request. Format: YYYY-MM-DD."
      />
      <GADate
        initialValue={endDate}
        onDateChanged={setEndDate}
        href="https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS.date_ranges"
        title="see dateRanges on Devsite."
        label="endDate"
        helperText="The end of the date range for the data request. Format: YYYY-MM-DD."
      />
      <SelectMultiple<Column>
        options={metrics || []}
        getOptionLabel={column => column.id!}
        label="Metrics"
        helperText="The dimensions to include in the request."
        renderOption={column => (
          <FancyOption
            right={
              <Typography variant="subtitle1" color="textSecondary">
                {column.attributes!.group}
              </Typography>
            }
          >
            <Typography variant="body1">{column.attributes!.uiName}</Typography>
            <Typography variant="subtitle2" color="primary">
              {column.id}
            </Typography>
          </FancyOption>
        )}
        onSelectedChanged={setSelectedMetrics}
        serializer={columns => ({
          key: StorageKey.histogramRequestMetric,
          serialized: JSON.stringify({ data: columns }),
        })}
        deserializer={(s: string) => JSON.parse(s).data}
      />
      <SelectMultiple<Column>
        options={dimensions || []}
        getOptionLabel={column => column.id!}
        label="Histogram Dimension"
        helperText="The dimensions to include in the request."
        renderOption={column => (
          <FancyOption
            right={
              <Typography variant="subtitle1" color="textSecondary">
                {column.attributes!.group}
              </Typography>
            }
          >
            <Typography variant="body1">{column.attributes!.uiName}</Typography>
            <Typography variant="subtitle2" color="primary">
              {column.id}
            </Typography>
          </FancyOption>
        )}
        onSelectedChanged={setSelectedDimensions}
        serializer={columns => ({
          key: StorageKey.histogramRequestDimension,
          serialized: JSON.stringify({ data: columns }),
        })}
        deserializer={(s: string) => JSON.parse(s).data}
      />
      <TextField
        InputProps={{
          endAdornment: (
            <ExternalLink
              href={linkFor("Dimension.FIELDS.histogram_buckets")}
              title={titleFor("histogramBuckets[]")}
            />
          ),
        }}
        size="small"
        variant="outlined"
        fullWidth
        label="Buckets"
        value={buckets}
        onChange={e => setBuckets(e.target.value)}
        required
        helperText="The buckets to use for the histogram request."
      />
      <TextField
        InputProps={{
          endAdornment: (
            <ExternalLink
              href={linkFor("ReportRequest.FIELDS.filters_expression")}
              title={titleFor("filtersExpression")}
            />
          ),
        }}
        size="small"
        variant="outlined"
        fullWidth
        label="Filters Expression"
        value={filtersExpression}
        onChange={e => setFiltersExpression(e.target.value)}
        helperText="Filters that restrict the data returned for the histogram request."
      />
      <SelectSingle<Segment>
        options={segments || []}
        getOptionLabel={segment => segment.segmentId!}
        label="Segment"
        helperText="The segment to use for the request."
        renderOption={segment => (
          <FancyOption
            right={
              <Typography variant="subtitle1" color="textSecondary">
                {segment.type === "CUSTOM"
                  ? "Custom Segment"
                  : "Built In Segment"}
              </Typography>
            }
          >
            <Typography variant="body1">{segment.name}</Typography>
            <Typography variant="subtitle2" color="primary">
              {segment.segmentId}
            </Typography>
          </FancyOption>
        )}
        onSelectedChanged={setSelectedSegment}
        serializer={segment => ({
          key: StorageKey.histogramRequestSegment,
          serialized: JSON.stringify(segment),
        })}
        deserializer={(s: string) => {
          if (s === "undefined") {
            return undefined
          }
          return JSON.parse(s)
        }}
      />
      <SelectSingle<SamplingLevel>
        options={Object.values(SamplingLevel)}
        getOptionLabel={samplingLevel => samplingLevel}
        label="samplingLevel"
        helperText="The desired sample size for the report."
        renderOption={samplingLevel => <>{samplingLevel}</>}
        onSelectedChanged={setSamplingLevel}
        serializer={s => ({
          key: StorageKey.histogramSamplingLevel,
          serialized: s?.toString() || "undefined",
        })}
        deserializer={s => {
          if (s === "undefined") {
            return undefined
          }
          return s as SamplingLevel
        }}
      />
      <Button variant="outlined" color="primary" onClick={makeRequest}>
        Make Request
      </Button>
      {longRequest && (
        <section className={classes.loadingIndicator}>
          <Loader type="Circles" color={theme.palette.primary.main} />
          <Typography>Loading...</Typography>
        </section>
      )}
      <ReportTable response={reportsResponse} />
    </>
  )
}

export default HistogramRequest
