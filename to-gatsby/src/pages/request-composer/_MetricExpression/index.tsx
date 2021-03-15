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
import LinkedTextField from "../../../components/LinkedTextField"
import { linkFor, titleFor } from "../_HistogramRequest"
import { HasView } from "../../../components/ViewSelector"
import useMetricExpressionRequestParameters from "./_useMetricExpressionRequestParameters"
import { Button, makeStyles, Typography } from "@material-ui/core"
import ReportsTable from "../_ReportsTable"
import {
  useMakeReportsRequest,
  useDimensionsAndMetrics,
  Column,
  Segment,
  SamplingLevel,
} from "../_api"
import useMetricExpressionRequest from "./_useMetricExpressionRequest"
import GADate from "../../../components/GADate"
import SelectMultiple from "../../../components/SelectMultiple"
import { FancyOption } from "../../../components/FancyOption"
import { StorageKey } from "../../../constants"
import SelectSingle from "../../../components/SelectSingle"
import { useSegments } from "../../../api"

const useStyles = makeStyles(theme => ({
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

interface MetricExpressionRequestProps {
  view: HasView | undefined
  controlWidth: string
}

const MetricExpression: React.FC<MetricExpressionRequestProps> = ({
  view,
  controlWidth,
}) => {
  const classes = useStyles()
  const { dimensions } = useDimensionsAndMetrics()
  const segments = useSegments()
  const {
    viewId,
    setViewId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    metricExpressions,
    setMetricExpressions,
    metricAliases,
    setMetricAliases,
    selectedDimensions,
    setSelectedDimensions,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
    pageSize,
    setPageSize,
    pageToken,
    setPageToken,
  } = useMetricExpressionRequestParameters(view)
  const requestObject = useMetricExpressionRequest({
    viewId,
    samplingLevel,
    filtersExpression,
    startDate,
    endDate,
    metricExpressions,
    metricAliases,
    selectedDimensions,
    selectedSegment,
    pageToken,
    pageSize,
  })
  const { response, makeRequest, longRequest } = useMakeReportsRequest(
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
        <LinkedTextField
          href={linkFor("Metric.FIELDS.expression")}
          linkTitle={titleFor("Metric.expression")}
          label="metric expressions"
          value={metricExpressions || ""}
          onChange={setMetricExpressions}
          required
          helperText="The metric expressions to include in the request. Separate multiple expressions with a comma."
        />
        <LinkedTextField
          href={linkFor("Metric.FIELDS.alias")}
          linkTitle={titleFor("Metric.alias")}
          label="metric aliases"
          value={metricAliases || ""}
          onChange={setMetricAliases}
          helperText="Aliases to use for your expressions. Separate multiple aliases with a comma."
        />
        <SelectMultiple<Column>
          options={dimensions || []}
          getOptionLabel={column => column.id!}
          label="dimensions"
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
            key: StorageKey.metricExpressionRequestDimensions,
            serialized: JSON.stringify({ data: columns }),
          })}
          deserializer={(s: string) => JSON.parse(s).data}
        />
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.filters_expression")}
          linkTitle={titleFor("filtersExpression")}
          label="Filters Expression"
          value={filtersExpression || ""}
          onChange={setFiltersExpression}
          helperText="Filters that restrict the data returned for the metric expression request."
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
            key: StorageKey.metricExpressionRequestSegment,
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
          onSelectedChanged={samplingLevel => {
            if (samplingLevel === undefined) {
              setSamplingLevel(SamplingLevel.Default)
            } else {
              setSamplingLevel(samplingLevel)
            }
          }}
          serializer={s => ({
            key: StorageKey.metricExpressionSamplingLevel,
            serialized: s?.toString() || SamplingLevel.Default,
          })}
          deserializer={s => {
            if (s === "undefined") {
              return undefined
            }
            return s as SamplingLevel
          }}
        />
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.page_token")}
          linkTitle={titleFor("pageToken")}
          label="pageToken"
          value={pageToken || ""}
          onChange={setPageToken}
          helperText="The continuation token to get the next page of the results."
        />
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.page_size")}
          linkTitle={titleFor("pageSize")}
          label="pageSize"
          value={pageSize || ""}
          onChange={setPageSize}
          helperText="The maximum number of rows to include in the response. Maximum of 100,000"
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
      <ReportsTable response={response} longRequest={longRequest} />
    </>
  )
}

export default MetricExpression
