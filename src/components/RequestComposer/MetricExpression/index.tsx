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
import { useEffect } from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"

import { usePersistentBoolean } from "@/hooks"
import { StorageKey } from "@/constants"
import LinkedTextField from "@/components/LinkedTextField"
import GADate from "@/components/GADate"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import {
  DimensionsPicker,
  SegmentPicker,
  V4SamplingLevelPicker,
} from "@/components/UAPickers"
import { linkFor, titleFor } from "../HistogramRequest/"
import useMetricExpressionRequestParameters from "./useMetricExpressionRequestParameters"
import useMetricExpressionRequest from "./useMetricExpressionRequest"
import { ReportsRequest } from "../RequestComposer"
import { UAAccountPropertyView } from "@/components/ViewSelector/useAccountPropertyView"
import useUADimensionsAndMetrics, {
  UADimensionsAndMetricsRequestCtx,
} from "@/components/UAPickers/useDimensionsAndMetrics"
import { successful } from "@/types"
import {
  UASegmentsRequestCtx,
  useUASegments,
} from "@/components/UAPickers/useUASegments"

interface MetricExpressionRequestProps {
  apv: UAAccountPropertyView
  controlWidth: string
  setRequestObject: (request: ReportsRequest | undefined) => void
}

const useStyles = makeStyles(theme => ({
  showSegments: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const MetricExpression: React.FC<MetricExpressionRequestProps> = ({
  apv,
  controlWidth,
  setRequestObject,
  children,
}) => {
  const classes = useStyles()
  const [
    showSegmentDefinition,
    setShowSegmentDefinition,
  ] = usePersistentBoolean(
    StorageKey.metricExpressionRequestShowSegmentDefinition,
    false
  )
  const uaDimensionsAndMetricsRequest = useUADimensionsAndMetrics(apv)
  const segmentsRequest = useUASegments()
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
    setSelectedDimensionIDs,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
    pageSize,
    setPageSize,
    pageToken,
    setPageToken,
  } = useMetricExpressionRequestParameters(
    apv,
    successful(uaDimensionsAndMetricsRequest)?.columns,
    successful(segmentsRequest)?.segments
  )
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

  useEffect(() => {
    setRequestObject(requestObject)
  }, [requestObject, setRequestObject])

  return (
    <UADimensionsAndMetricsRequestCtx.Provider
      value={uaDimensionsAndMetricsRequest}
    >
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
          required
          value={startDate || ""}
          onChange={setStartDate}
          href="https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS.date_ranges"
          linkTitle="see dateRanges on Devsite."
          label="startDate"
          helperText="The start of the date range for the data request. Format: YYYY-MM-DD."
        />
        <GADate
          required
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
        <DimensionsPicker
          {...apv}
          selectedDimensions={selectedDimensions}
          setDimensionIDs={setSelectedDimensionIDs}
          helperText="The dimensions to include in the request."
        />
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.filters_expression")}
          linkTitle={titleFor("filtersExpression")}
          label="Filters Expression"
          value={filtersExpression || ""}
          onChange={setFiltersExpression}
          helperText="Filters that restrict the data returned for the metric expression request."
        />
        <UASegmentsRequestCtx.Provider value={segmentsRequest}>
          <SegmentPicker
            segment={selectedSegment}
            setSegmentID={setSelectedSegmentID}
            showSegmentDefinition={showSegmentDefinition}
          />
        </UASegmentsRequestCtx.Provider>
        <LabeledCheckbox
          className={classes.showSegments}
          checked={showSegmentDefinition}
          setChecked={setShowSegmentDefinition}
        >
          Show segment definitions instead of IDs.
        </LabeledCheckbox>
        <V4SamplingLevelPicker
          setSamplingLevel={setSamplingLevel}
          storageKey={StorageKey.metricExpressionSamplingLevel}
          helperText="The desired sample size for the report."
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
        {children}
      </section>
    </UADimensionsAndMetricsRequestCtx.Provider>
  )
}

export default MetricExpression
