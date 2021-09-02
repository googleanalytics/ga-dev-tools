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
import {
  MetricsPicker,
  DimensionsPicker,
  SegmentPicker,
  V4SamplingLevelPicker,
} from "@/components/UAPickers"
import useHistogramRequest from "./useHistogramRequest"
import useHistogramRequestParameters from "./useHistogramRequestParameters"
import { ReportsRequest } from "../RequestComposer"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { UAAccountPropertyView } from "@/components/ViewSelector/useAccountPropertyView"
import { successful } from "@/types"
import useUADimensionsAndMetrics, {
  UADimensionsAndMetricsRequestCtx,
} from "@/components/UAPickers/useDimensionsAndMetrics"
import {
  UASegmentsRequestCtx,
  useUASegments,
} from "@/components/UAPickers/useUASegments"

export const linkFor = (hash: string) =>
  `https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#${hash}`

export const titleFor = (id: string) => `See ${id} on devsite.`

interface HistogramRequestProps {
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

const HistogramRequest: React.FC<HistogramRequestProps> = ({
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
    StorageKey.histogramRequestShowSegmentDefinition,
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
    selectedDimensions,
    setSelectedDimensionIDs,
    selectedMetrics,
    setSelectedMetricIDs,
    buckets,
    setBuckets,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
  } = useHistogramRequestParameters(
    apv,
    successful(uaDimensionsAndMetricsRequest)?.columns,
    successful(segmentsRequest)?.segments
  )
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
        <MetricsPicker
          {...apv}
          selectedMetrics={selectedMetrics}
          setMetricIDs={setSelectedMetricIDs}
          helperText="The metrics to include in the request."
        />
        <DimensionsPicker
          {...apv}
          selectedDimensions={selectedDimensions}
          setDimensionIDs={setSelectedDimensionIDs}
          helperText="The dimensions to include in the request."
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
          storageKey={StorageKey.histogramSamplingLevel}
          helperText="The desired sample size for the report."
        />
        {children}
      </section>
    </UADimensionsAndMetricsRequestCtx.Provider>
  )
}

export default HistogramRequest
