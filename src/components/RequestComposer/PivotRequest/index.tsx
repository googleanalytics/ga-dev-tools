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
import GADate from "@/components/GADate"
import LinkedTextField from "@/components/LinkedTextField"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import {
  MetricsPicker,
  DimensionsPicker,
  SegmentPicker,
  V4SamplingLevelPicker,
} from "@/components/UAPickers"
import { ReportsRequest } from "../RequestComposer"
import { linkFor, titleFor } from "../HistogramRequest"
import usePivotRequestParameters from "./usePivotRequestParameters"
import usePivotRequest from "./usePivotRequest"
import { UAAccountPropertyView } from "@/components/ViewSelector/useAccountPropertyView"
import useUADimensionsAndMetrics, {
  UADimensionsAndMetricsRequestCtx,
} from "@/components/UAPickers/useDimensionsAndMetrics"
import { successful } from "@/types"
import {
  UASegmentsRequestCtx,
  useUASegments,
} from "@/components/UAPickers/useUASegments"

interface PivotRequestProps {
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

const PivotRequest: React.FC<PivotRequestProps> = ({
  apv,
  controlWidth,
  setRequestObject,
  children,
}) => {
  const classes = useStyles()
  const [
    showSegmentDefinition,
    setShowSegmentDefinition,
  ] = usePersistentBoolean(StorageKey.pivotRequestShowSegmentDefinition, false)

  const uaDimensionsAndMetricsRequest = useUADimensionsAndMetrics(apv)
  const segmentsRequest = useUASegments()

  const {
    viewId,
    setViewId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedMetrics,
    setSelectedMetricIDs,
    selectedDimensions,
    setSelectedDimensionIDs,
    pivotMetrics,
    setPivotMetricIDs,
    pivotDimensions,
    setPivotDimensionIDs,
    startGroup,
    setStartGroup,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
    maxGroupCount,
    setMaxGroupCount,
    includeEmptyRows,
    setIncludeEmptyRows,
    pageToken,
    setPageToken,
    pageSize,
    setPageSize,
  } = usePivotRequestParameters(
    apv,
    successful(uaDimensionsAndMetricsRequest)?.columns,
    successful(segmentsRequest)?.segments
  )
  const requestObject = usePivotRequest({
    viewId,
    startDate,
    endDate,
    metrics: selectedMetrics,
    dimensions: selectedDimensions,
    pivotMetrics,
    pivotDimensions,
    selectedSegment,
    startGroup,
    samplingLevel,
    maxGroupCount,
    includeEmptyRows,
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
        <MetricsPicker
          {...apv}
          required
          selectedMetrics={selectedMetrics}
          setMetricIDs={setSelectedMetricIDs}
          helperText="The metrics to include in the request."
        />
        <DimensionsPicker
          {...apv}
          required
          selectedDimensions={selectedDimensions}
          setDimensionIDs={setSelectedDimensionIDs}
          helperText="The dimensions to include in the request."
        />
        <MetricsPicker
          {...apv}
          required
          selectedMetrics={pivotMetrics}
          setMetricIDs={setPivotMetricIDs}
          label="pivot metrics"
          helperText="The pivot metrics to include in the request."
        />
        <DimensionsPicker
          {...apv}
          required
          selectedDimensions={pivotDimensions}
          setDimensionIDs={setPivotDimensionIDs}
          label="pivot dimensions"
          helperText="The pivot dimensions to include in the request."
        />
        <LinkedTextField
          href={linkFor("Pivot.FIELDS.start_group")}
          linkTitle={titleFor("startGroup")}
          label="Pivot startGroup"
          value={startGroup || ""}
          onChange={setStartGroup}
          helperText="The pivot start group"
        />
        <LinkedTextField
          href={linkFor("Pivot.FIELDS.max_group_count")}
          linkTitle={titleFor("maxGroupCount")}
          label="Pivot maxGroupCount"
          value={maxGroupCount || ""}
          onChange={setMaxGroupCount}
          helperText="The maximum number of groups to return."
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
          storageKey={StorageKey.pivotSamplingLevel}
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
        <LabeledCheckbox
          checked={includeEmptyRows}
          setChecked={setIncludeEmptyRows}
          className={classes.showSegments}
        >
          Include Empty Rows
        </LabeledCheckbox>
        <br />
        {children}
      </section>
    </UADimensionsAndMetricsRequestCtx.Provider>
  )
}

export default PivotRequest
