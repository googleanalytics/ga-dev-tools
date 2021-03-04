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
} from "@material-ui/core"
import { HasView } from "../../components/ViewSelector"
import GADate from "../../components/GADate"
import {
  GetReportsResponse,
  Column,
  useAnalyticsReportingAPI,
  useDimensionsAndMetrics,
} from "./_api"
import SelectMultiple from "../../components/SelectMultiple"
import { StorageKey } from "../../constants"
import { FancyOption } from "../../components/FancyOption"

const useStyles = makeStyles(_ => ({
  container: {
    maxHeight: 440,
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
    <>
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
    </>
  )
}

const linkFor = (hash: string) =>
  `https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#${hash}`

const titleFor = (id: string) => `See ${id} on devsite.`

interface HistogramRequestProps {
  view: HasView | undefined
}

const HistogramRequest: React.FC<HistogramRequestProps> = ({ view }) => {
  const reportingAPI = useAnalyticsReportingAPI()
  const [viewId, setViewId] = React.useState("")
  const [startDate, setStartDate] = React.useState("7daysAgo")
  const [endDate, setEndDate] = React.useState("yesterday")
  const [selectedDimensions, setSelectedDimensions] = React.useState<Column[]>(
    []
  )
  const [selectedMetrics, setSelectedMetrics] = React.useState<Column[]>([])
  const [buckets, setBuckets] = React.useState("")

  const { dimensions, metrics } = useDimensionsAndMetrics()

  const [reportsResponse, setReportsResponse] = React.useState<
    GetReportsResponse | undefined
  >()

  React.useMemo(() => {
    const id = view?.view.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [view])

  const makeRequest = React.useCallback(() => {
    if (reportingAPI === undefined) {
      return
    }
    const optionals = {}
    if (selectedMetrics.length > 0) {
      optionals["metrics"] = selectedMetrics.map(column => ({
        expression: column.id,
      }))
    }
    if (selectedDimensions.length > 0) {
      optionals["dimensions"] = selectedDimensions.map(column => ({
        histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)),
        name: column.id,
      }))
    }
    reportingAPI.reports
      .batchGet(
        {},
        {
          reportRequests: [
            {
              viewId: viewId,
              dateRanges: [
                {
                  startDate,
                  endDate,
                },
              ],
              ...optionals,
            },
          ],
        }
      )
      .then(response => setReportsResponse(response.result), console.error)
  }, [
    viewId,
    reportingAPI,
    startDate,
    endDate,
    selectedMetrics,
    selectedDimensions,
    buckets,
  ])

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
      <Button onClick={makeRequest}>Test Request</Button>

      <ReportTable response={reportsResponse} />
    </>
  )
}

export default HistogramRequest
