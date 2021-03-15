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
import { Button, makeStyles, Typography } from "@material-ui/core"

import { HasView } from "../../../components/ViewSelector"
import {
  Column,
  useDimensionsAndMetrics,
  Segment,
  useMakeReportsRequest,
  SamplingLevel,
} from "../_api"
import SelectMultiple from "../../../components/SelectMultiple"
import { StorageKey } from "../../../constants"
import { FancyOption } from "../../../components/FancyOption"
import { useSegments } from "../../../api"
import SelectSingle from "../../../components/SelectSingle"
import LinkedTextField from "../../../components/LinkedTextField"
import GADate from "../../../components/GADate"
import useHistogramRequest from "./_useHistogramRequest"
import useHistogramRequestParameters from "./_useHistogramRequestParameters"
import ReportsTable from "../_ReportsTable"
import PrettyJson, {
  shouldCollapseResponse,
  shouldCollapseRequest,
} from "../_PrettyJson"

const useStyles = makeStyles(theme => ({
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

export const linkFor = (hash: string) =>
  `https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#${hash}`

export const titleFor = (id: string) => `See ${id} on devsite.`

interface HistogramRequestProps {
  view: HasView | undefined
  controlWidth: string
}

const HistogramRequest: React.FC<HistogramRequestProps> = ({
  view,
  controlWidth,
}) => {
  const classes = useStyles()
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
  const requestObject = useHistogramRequest({
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

  const { makeRequest, response, longRequest } = useMakeReportsRequest(
    requestObject
  )

  return (
    <>
      <section className={controlWidth}>
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.view_id")}
          linkTitle={titleFor("viewId")}
          label="viewId"
          value={viewId}
          onChange={setViewId}
          required
          helperText="The analytics view ID from which to retrieve data."
        />
        <GADate
          value={startDate || ""}
          onChange={setStartDate}
          href="https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS.date_ranges"
          linkTitle="see dateRanges on Devsite."
          label="startDate"
          helperText="The start of the date range for the data request. Format: YYYY-MM-DD."
        />
        <GADate
          value={endDate || ""}
          onChange={setEndDate}
          href="https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS.date_ranges"
          linkTitle="see dateRanges on Devsite."
          label="endDate"
          helperText="The end of the date range for the data request. Format: YYYY-MM-DD."
        />
        <SelectMultiple<Column>
          options={metrics || []}
          getOptionLabel={column => column.id!}
          label="Metrics"
          helperText="The metrics to include in the request."
          renderOption={column => (
            <FancyOption
              right={
                <Typography variant="subtitle1" color="textSecondary">
                  {column.attributes!.group}
                </Typography>
              }
            >
              <Typography variant="body1">
                {column.attributes!.uiName}
              </Typography>
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
              <Typography variant="body1">
                {column.attributes!.uiName}
              </Typography>
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
        <LinkedTextField
          href={linkFor("Dimension.FIELDS.histogram_buckets")}
          linkTitle={titleFor("histogramBuckets[]")}
          label="Buckets"
          value={buckets || ""}
          onChange={setBuckets}
          required
          helperText="The buckets to use for the histogram request."
        />
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.filters_expression")}
          linkTitle={titleFor("filtersExpression")}
          label="Filters Expression"
          value={filtersExpression || ""}
          onChange={setFiltersExpression}
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
        <Button
          variant="contained"
          color="primary"
          onClick={makeRequest}
          className={classes.makeRequest}
        >
          Make Request
        </Button>
      </section>

      <section>
        <Typography variant="h3">Request JSON</Typography>
        <PrettyJson
          object={requestObject}
          shouldCollapse={shouldCollapseRequest}
        />
      </section>
      <ReportsTable response={response} longRequest={longRequest} />
    </>
  )
}

export default HistogramRequest
