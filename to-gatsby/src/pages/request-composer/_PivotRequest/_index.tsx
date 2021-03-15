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
import {
  Typography,
  Button,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import { linkFor, titleFor } from "../_HistogramRequest/_index"
import usePivotRequestParameters from "./_usePivotRequestParameters"
import SelectSingle from "../../../components/SelectSingle"
import {
  Column,
  useDimensionsAndMetrics,
  Segment,
  useSegments,
  SamplingLevel,
  useMakeReportsRequest,
} from "../_api"
import { FancyOption } from "../../../components/FancyOption"
import SelectMultiple from "../../../components/SelectMultiple"
import { StorageKey } from "../../../constants"
import { HasView } from "../../../components/ViewSelector"
import usePivotRequest from "./_usePivotRequest"
import GADate from "../../../components/GADate"
import LinkedTextField from "../../../components/LinkedTextField"
import ReportsTable from "../_ReportsTable"
import PrettyJson, { shouldCollapseRequest } from "../_PrettyJson"

const useStyles = makeStyles(theme => ({
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

interface PivotRequestProps {
  view: HasView | undefined
  controlWidth: string
}

const PivotRequest: React.FC<PivotRequestProps> = ({ view, controlWidth }) => {
  const classes = useStyles()

  const { metrics, dimensions } = useDimensionsAndMetrics()
  const segments = useSegments()

  const {
    viewId,
    setViewId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedMetrics,
    setSelectedMetrics,
    selectedDimensions,
    setSelectedDimensions,
    pivotMetrics,
    setPivotMetrics,
    pivotDimensions,
    setPivotDimensions,
    startGroup,
    setStartGroup,
    selectedSegment,
    setSelectedSegment,
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
  } = usePivotRequestParameters(view)
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
  const { makeRequest, longRequest, response } = useMakeReportsRequest(
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
          serializer={column => ({
            key: StorageKey.pivotRequestMetrics,
            serialized: JSON.stringify(column),
          })}
          deserializer={(s: string) => {
            return JSON.parse(s)
          }}
        />
        <SelectMultiple<Column>
          options={dimensions || []}
          getOptionLabel={column => column.id!}
          label="Dimensions"
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
          serializer={column => ({
            key: StorageKey.pivotRequestDimensions,
            serialized: JSON.stringify(column),
          })}
          deserializer={(s: string) => {
            return JSON.parse(s)
          }}
        />
        <SelectMultiple<Column>
          options={metrics || []}
          getOptionLabel={column => column.id!}
          label="Pivot Metrics"
          helperText="The pivot metrics to include in the request."
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
          onSelectedChanged={setPivotMetrics}
          serializer={column => ({
            key: StorageKey.pivotRequestPivotMetrics,
            serialized: JSON.stringify(column),
          })}
          deserializer={(s: string) => {
            return JSON.parse(s)
          }}
        />
        <SelectMultiple<Column>
          options={dimensions || []}
          getOptionLabel={column => column.id!}
          label="Pivot Dimensions"
          helperText="The pivot dimensions to include in the request."
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
          onSelectedChanged={setPivotDimensions}
          serializer={column => ({
            key: StorageKey.pivotRequestPivotDimensions,
            serialized: JSON.stringify(column),
          })}
          deserializer={(s: string) => {
            return JSON.parse(s)
          }}
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
            key: StorageKey.pivotRequestSegment,
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
            key: StorageKey.pivotSamplingLevel,
            serialized: s?.toString() || "undefined",
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
        <FormControlLabel
          control={
            <Checkbox
              checked={includeEmptyRows}
              onChange={e => setIncludeEmptyRows(e.target.checked)}
            />
          }
          label="Include Empty Rows"
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

      <PrettyJson
        object={requestObject}
        shouldCollapse={shouldCollapseRequest}
      />
      <ReportsTable response={response} longRequest={longRequest} />
    </>
  )
}

export default PivotRequest
