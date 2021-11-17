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

import { Typography, TextField, makeStyles } from "@material-ui/core"
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete"
import { usePersistentString } from "@/hooks"
import { StorageKey } from "@/constants"
import { Column as ColumnT, Segment as SegmentT } from "@/types/ua"
import { Dispatch, RequestStatus, successful } from "@/types"
import { UADimensionsAndMetricsRequestCtx } from "./useDimensionsAndMetrics"
import { UASegmentsRequestCtx } from "./useUASegments"

export enum V4SamplingLevel {
  Default = "DEFAULT",
  SMALL = "SMALL",
  LARGE = "LARGE",
}
export enum V3SamplingLevel {
  Default = "DEFAULT",
  Faster = "FASTER",
  HigherPrecision = "HIGHER_PRECISION",
}
export enum CohortSize {
  Day = "DAY",
  Week = "WEEK",
  Month = "MONTH",
}

const removeDeprecatedColumns = (column: ColumnT): true | false =>
  column.attributes?.status !== "DEPRECATED"

const useColumnStyles = makeStyles(() => ({
  option: {
    display: "flex",
    width: "100%",
  },
  left: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
}))

const Column: React.FC<{ column: ColumnT }> = ({ column }) => {
  const classes = useColumnStyles()
  return (
    <div className={classes.option}>
      <div className={classes.left}>
        <Typography variant="body1" component="div">
          {column.attributes!.uiName}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {column.id}
        </Typography>
      </div>
      <Typography variant="subtitle1" color="textSecondary">
        {column.attributes!.group}
      </Typography>
    </div>
  )
}

const columnFilterOptions = createFilterOptions<ColumnT>({
  stringify: option => `${option.id} ${option.attributes?.uiName || ""}`,
})

export const DimensionPicker: React.FC<{
  selectedDimension: ColumnT | undefined
  setDimensionID: Dispatch<string | undefined>
  required?: true | undefined
  helperText?: string
}> = ({ helperText, selectedDimension, setDimensionID, required }) => {
  const request = React.useContext(UADimensionsAndMetricsRequestCtx)

  return (
    <Autocomplete<ColumnT, false, undefined, true>
      filterOptions={columnFilterOptions}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      loading={request.status === RequestStatus.InProgress}
      options={
        successful(request)?.dimensions.filter(removeDeprecatedColumns) || []
      }
      getOptionLabel={dimension => dimension.id!}
      value={selectedDimension || null}
      onChange={(_event, value) =>
        setDimensionID(value === null ? undefined : (value as ColumnT).id)
      }
      renderOption={column => <Column column={column} />}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label="dimensions"
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export const DimensionsPicker: React.FC<{
  selectedDimensions: ColumnT[] | undefined
  setDimensionIDs: Dispatch<string[] | undefined>
  required?: true | undefined
  helperText?: string
  label?: string
}> = ({
  helperText,
  selectedDimensions,
  setDimensionIDs,
  required,
  label = "dimensions",
}) => {
  const request = React.useContext(UADimensionsAndMetricsRequestCtx)

  return (
    <Autocomplete<ColumnT, true, undefined, true>
      filterOptions={columnFilterOptions}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      loading={request.status === RequestStatus.InProgress}
      options={
        successful(request)
          ?.dimensions.filter(removeDeprecatedColumns)
          .filter(
            option =>
              (selectedDimensions || []).find(s => s.id === option.id) ===
              undefined
          ) || []
      }
      getOptionLabel={dimension => dimension.id!}
      value={selectedDimensions || []}
      onChange={(_event, value) =>
        setDimensionIDs((value as ColumnT[])?.map(c => c.id!))
      }
      renderOption={column => <Column column={column} />}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label={label}
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export const MetricPicker: React.FC<{
  selectedMetric: ColumnT | undefined
  setMetricID: Dispatch<string | undefined>
  required?: true | undefined
  helperText?: string
  filter?: (metric: ColumnT) => boolean
}> = ({ helperText, selectedMetric, setMetricID, required, filter }) => {
  const request = React.useContext(UADimensionsAndMetricsRequestCtx)

  return (
    <Autocomplete<ColumnT, false, undefined, true>
      filterOptions={columnFilterOptions}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      loading={request.status === RequestStatus.InProgress}
      options={
        successful(request)
          ?.metrics.filter(removeDeprecatedColumns)
          .filter(filter !== undefined ? filter : () => true) || []
      }
      getOptionLabel={metric => metric.id!}
      value={selectedMetric || null}
      onChange={(_event, value) =>
        setMetricID(value === null ? undefined : (value as ColumnT).id)
      }
      renderOption={column => <Column column={column} />}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label="metric"
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export const MetricsPicker: React.FC<{
  selectedMetrics: ColumnT[] | undefined
  setMetricIDs: Dispatch<string[] | undefined>
  required?: true | undefined
  helperText?: string
  label?: string
}> = ({
  helperText,
  selectedMetrics,
  setMetricIDs,
  required,
  label = "metrics",
}) => {
  const request = React.useContext(UADimensionsAndMetricsRequestCtx)

  return (
    <Autocomplete<ColumnT, true, undefined, true>
      filterOptions={columnFilterOptions}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      loading={request.status === RequestStatus.InProgress}
      options={
        successful(request)
          ?.metrics.filter(removeDeprecatedColumns)
          .filter(
            option =>
              (selectedMetrics || []).find(s => s.id === option.id) ===
              undefined
          ) || []
      }
      getOptionLabel={metric => metric.id!}
      value={selectedMetrics || []}
      onChange={(_event, value) =>
        setMetricIDs((value as ColumnT[])?.map(c => c.id!))
      }
      renderOption={column => <Column column={column} />}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label={label}
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

const Segment: React.FC<{
  segment: SegmentT
  showSegmentDefinition: boolean
}> = ({ segment, showSegmentDefinition }) => {
  const classes = useColumnStyles()
  const subtitleText = showSegmentDefinition
    ? segment.definition || `${segment.name} has no segment definition.`
    : segment.segmentId || ""
  const abbreviatedText =
    subtitleText.length > 40
      ? subtitleText.substring(0, 40) + "..."
      : subtitleText
  return (
    <div className={classes.option}>
      <div className={classes.left}>
        <Typography variant="body1" component="div">
          {segment.name}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {abbreviatedText}
        </Typography>
      </div>
      <Typography variant="subtitle1" color="textSecondary">
        {segment.type === "CUSTOM"
          ? "Custom Segment"
          : segment.type === "DYNAMIC"
          ? "Dynamic Segment"
          : "Built In Segment"}
      </Typography>
    </div>
  )
}

const segmentFilterOptions = createFilterOptions<SegmentT>({
  stringify: option => `${option.segmentId} ${option.name}`,
})
export const SegmentPicker: React.FC<{
  segment: SegmentT | undefined
  setSegmentID: Dispatch<string | undefined>
  showSegmentDefinition: boolean
  required?: true | undefined
  helperText?: string
}> = ({
  helperText,
  segment,
  setSegmentID,
  required,
  showSegmentDefinition,
}) => {
  const request = React.useContext(UASegmentsRequestCtx)

  const getOptionLabel = React.useCallback(
    (segment: SegmentT) =>
      (showSegmentDefinition
        ? segment.definition ||
          (segment.name && `${segment.name} has no segment definiton.`)
        : segment.segmentId!) || "",
    [showSegmentDefinition]
  )

  return (
    <Autocomplete<SegmentT, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      loading={request.status === RequestStatus.InProgress}
      options={successful(request)?.segments || []}
      getOptionSelected={(a, b) =>
        a.id === b.id || a.definition === b.definition
      }
      getOptionLabel={getOptionLabel}
      value={segment || null}
      filterOptions={(options, params) => {
        const filtered = segmentFilterOptions(options || [], params)

        // Add entry for creating a dynamic segment based on input.
        if (params.inputValue !== "") {
          filtered.push({
            definition: params.inputValue,
            name: `Add dynamic segment`,
            segmentId: params.inputValue,
            id: params.inputValue,
            type: "DYNAMIC",
          })
        }
        return filtered
      }}
      onChange={(_event, value) => {
        setSegmentID(value === null ? undefined : (value as SegmentT).id)
      }}
      renderOption={column => (
        <Segment
          showSegmentDefinition={showSegmentDefinition}
          segment={column}
        />
      )}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label="segments"
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export const V4SamplingLevelPicker: React.FC<{
  storageKey: StorageKey
  setSamplingLevel: React.Dispatch<
    React.SetStateAction<V4SamplingLevel | undefined>
  >
  required?: true | undefined
  helperText?: string
}> = ({ helperText, setSamplingLevel, required, storageKey }) => {
  const [selected, setSelected] = usePersistentString(storageKey)

  React.useEffect(() => {
    setSamplingLevel(selected as V4SamplingLevel)
  }, [selected, setSamplingLevel])

  return (
    <Autocomplete<NonNullable<V4SamplingLevel>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={Object.values(V4SamplingLevel)}
      getOptionLabel={segment => segment}
      value={selected || null}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as V4SamplingLevel))
      }
      renderOption={column => column}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label="sampling level"
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export const V3SamplingLevelPicker: React.FC<{
  samplingLevel: V3SamplingLevel | undefined
  setSamplingLevel: Dispatch<V3SamplingLevel | undefined>
  required?: true | undefined
  helperText?: string
}> = ({ helperText, samplingLevel, setSamplingLevel, required }) => {
  return (
    <Autocomplete<NonNullable<V3SamplingLevel>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={Object.values(V3SamplingLevel)}
      getOptionLabel={segment => segment}
      value={samplingLevel || null}
      onChange={(_event, value) =>
        setSamplingLevel(
          value === null ? undefined : (value as V3SamplingLevel)
        )
      }
      renderOption={column => column}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label="sampling level"
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export const CohortSizePicker: React.FC<{
  storageKey: StorageKey
  setCohortSize: React.Dispatch<React.SetStateAction<CohortSize | undefined>>
  required?: true | undefined
  helperText?: string
}> = ({ helperText, setCohortSize, required, storageKey }) => {
  const [selected, setSelected] = usePersistentString(storageKey)

  React.useEffect(() => {
    setCohortSize(selected as CohortSize)
  }, [selected, setCohortSize])

  return (
    <Autocomplete<NonNullable<CohortSize>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={Object.values(CohortSize)}
      getOptionLabel={segment => segment}
      value={selected || null}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as CohortSize))
      }
      renderOption={column => column}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label="cohort size"
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}
