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
import { useState } from "react"
import { Dispatch, RequestStatus } from "@/types"
import useAvailableColumns from "./useAvailableColumns"
import { DimensionsAndMetricsRequestCtx } from "../ga4/DimensionsMetricsExplorer/useDimensionsAndMetrics"

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

export type GA4Dimension = gapi.client.analyticsdata.DimensionMetadata
export type GA4Dimensions = GA4Dimension[] | undefined
export type GA4Metric = gapi.client.analyticsdata.MetricMetadata
export type GA4Metrics = GA4Metric[] | undefined
type GA4Column = GA4Dimension | GA4Dimension

const Column: React.FC<{ column: GA4Column }> = ({ column }) => {
  const classes = useColumnStyles()
  return (
    <div className={classes.option}>
      <div className={classes.left}>
        <Typography variant="body1" component="div">
          {column.uiName}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {column.apiName}
        </Typography>
      </div>
      <Typography variant="subtitle1" color="textSecondary"></Typography>
    </div>
  )
}

const dimensionsFilterOptions = createFilterOptions<GA4Dimension>({
  stringify: option => `${option.uiName} ${option.apiName}`,
})
export const DimensionsPicker: React.FC<{
  dimensions: GA4Dimensions
  // TODO - migrate away entirely from setDimensions and only use the IDs and make
  // it required.
  setDimensions?: React.Dispatch<React.SetStateAction<GA4Dimensions>>
  setDimensionIDs?: Dispatch<string[] | undefined>
  required?: boolean
  helperText?: string | JSX.Element
  label?: string
}> = ({
  helperText,
  dimensions,
  setDimensions,
  setDimensionIDs,
  required,
  label = "dimensions",
}) => {
  const request = React.useContext(DimensionsAndMetricsRequestCtx)
  const { dimensionOptionsLessSelected } = useAvailableColumns({
    selectedDimensions: dimensions,
    selectedMetrics: [],
    request,
  })

  return (
    <Autocomplete<NonNullable<GA4Dimension>, true, undefined, true>
      filterOptions={dimensionsFilterOptions}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      loading={request.status === RequestStatus.InProgress}
      options={dimensionOptionsLessSelected || []}
      getOptionLabel={dimension => dimension.apiName!}
      value={dimensions || []}
      onChange={(_event, value) => {
        if (setDimensions !== undefined) {
          value.length === 0
            ? setDimensions(undefined)
            : setDimensions(value as GA4Dimensions)
        }
        if (setDimensionIDs !== undefined) {
          value.length === 0
            ? setDimensionIDs(undefined)
            : setDimensionIDs((value as GA4Dimension[]).map(m => m.apiName!))
        }
      }}
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

const metricsFilterOptions = createFilterOptions<GA4Metric>({
  stringify: option => `${option.uiName} ${option.apiName}`,
})
export const MetricsPicker: React.FC<{
  metrics: GA4Metrics
  // TODO - migrate away entirely from setMetrics and only use the IDs and make
  // it required.
  setMetrics?: React.Dispatch<React.SetStateAction<GA4Metrics>>
  setMetricIDs?: Dispatch<string[] | undefined>
  required?: boolean
  helperText?: string | JSX.Element
  label?: string
}> = ({
  helperText,
  metrics,
  setMetrics,
  setMetricIDs: setMetricsIDs,
  required,
  label = "metrics",
}) => {
  const request = React.useContext(DimensionsAndMetricsRequestCtx)
  const { metricOptionsLessSelected } = useAvailableColumns({
    selectedMetrics: metrics,
    selectedDimensions: [],
    request,
  })

  // TODO - I'm not sure this should be a freeSolo.

  return (
    <Autocomplete<GA4Metric, true, undefined, true>
      filterOptions={metricsFilterOptions}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      loading={request.status === RequestStatus.InProgress}
      options={metricOptionsLessSelected || []}
      getOptionLabel={metric => metric.apiName!}
      value={metrics || []}
      onChange={(_event, value) => {
        if (setMetrics !== undefined) {
          value.length === 0
            ? setMetrics(undefined)
            : setMetrics(value as GA4Metrics)
        }
        if (setMetricsIDs !== undefined) {
          value.length === 0
            ? setMetricsIDs(undefined)
            : setMetricsIDs((value as GA4Metric[]).map(m => m.apiName!))
        }
      }}
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

export const DimensionPicker: React.FC<{
  autoSelectIfOne?: boolean
  setDimension?: Dispatch<GA4Dimension | undefined>
  dimensionFilter?: (dimension: GA4Dimension) => boolean
  required?: boolean
  helperText?: string | JSX.Element
  label?: string
  className?: string
}> = ({
  autoSelectIfOne,
  helperText,
  setDimension,
  required,
  dimensionFilter,
  className,
  label = "dimension",
}) => {
  const [selected, setSelected] = useState<GA4Dimension>()
  const request = React.useContext(DimensionsAndMetricsRequestCtx)
  const {
    dimensionOptions,
    dimensionOptionsLessSelected,
  } = useAvailableColumns({
    selectedDimensions: selected === undefined ? [] : [selected],
    selectedMetrics: [],
    request,
    dimensionFilter,
  })

  React.useEffect(() => {
    if (setDimension !== undefined) {
      setDimension(selected)
    }
  }, [selected, setDimension])

  // If there is only one option, and autoSelectIfOne is choosen and nothing
  // has been selected yet.
  React.useEffect(() => {
    if (
      autoSelectIfOne &&
      selected === undefined &&
      dimensionOptions?.length === 1
    ) {
      setSelected(dimensionOptions[0])
    }
  }, [dimensionOptions, selected, autoSelectIfOne])

  // Unchoose the selected option if it is not in the options.
  React.useEffect(() => {
    if (selected === undefined || dimensionOptions === undefined) {
      return
    }
    const inOption = dimensionOptions.find(
      option => option.apiName === selected.apiName
    )
    if (inOption === undefined) {
      setSelected(undefined)
    }
  }, [selected, dimensionOptions, setSelected])

  return (
    <Autocomplete<NonNullable<GA4Dimension>, false, undefined, true>
      filterOptions={dimensionsFilterOptions}
      className={className}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      loading={request.status === RequestStatus.InProgress}
      options={dimensionOptionsLessSelected || []}
      getOptionLabel={dimension => dimension.apiName!}
      value={selected === undefined ? null : selected}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as GA4Dimension))
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
  autoSelectIfOne?: boolean
  setMetric?: Dispatch<GA4Metric | undefined>
  metricFilter?: (metric: GA4Metric) => boolean
  required?: true | undefined
  helperText?: string | JSX.Element
  label?: string
  className?: string
}> = ({
  autoSelectIfOne,
  helperText,
  setMetric,
  required,
  metricFilter,
  className,
  label = "metric",
}) => {
  const [selected, setSelected] = useState<GA4Metric>()
  const request = React.useContext(DimensionsAndMetricsRequestCtx)
  const { metricOptions, metricOptionsLessSelected } = useAvailableColumns({
    selectedMetrics: selected === undefined ? [] : [selected],
    selectedDimensions: [],
    request,
    metricFilter,
  })

  React.useEffect(() => {
    if (setMetric !== undefined) {
      setMetric(selected)
    }
  }, [selected, setMetric])

  // If there is only one option, and autoSelectIfOne is choosen and nothing
  // has been selected yet.
  React.useEffect(() => {
    if (
      autoSelectIfOne &&
      selected === undefined &&
      metricOptions?.length === 1
    ) {
      setSelected(metricOptions[0])
    }
  }, [metricOptions, selected, autoSelectIfOne])

  // Unchoose the selected option if it is not in the options.
  React.useEffect(() => {
    if (selected === undefined || metricOptions === undefined) {
      return
    }
    const inOption = metricOptions.find(
      option => option.apiName === selected.apiName
    )
    if (inOption === undefined) {
      setSelected(undefined)
    }
  }, [selected, metricOptions, setSelected])

  return (
    <Autocomplete<NonNullable<GA4Metric>, false, undefined, true>
      filterOptions={metricsFilterOptions}
      className={className}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      loading={request.status === RequestStatus.InProgress}
      options={metricOptionsLessSelected || []}
      getOptionLabel={metric => metric.apiName!}
      value={selected === undefined ? null : selected}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as GA4Metric))
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
