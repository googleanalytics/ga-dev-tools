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
import Autocomplete from "@material-ui/lab/Autocomplete"
import { usePersistantObject } from "../hooks"
import { StorageKey } from "../constants"
import { useSelector } from "react-redux"
import { useMemo, useEffect, useState } from "react"
import { Dispatch } from "../types"
import { Dimension } from "../pages/ga4/dimensions-metrics-explorer/_hooks"

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

type UseAvailableColumns = (arg: {
  selectedMetrics: GA4Metrics
  selectedDimensions: GA4Dimensions
  dimensionFilter?: (dimension: Dimension) => boolean
  property?: string
}) => {
  metricOptions: GA4Metrics
  dimensionOptions: GA4Dimensions
}
const useAvailableColumns: UseAvailableColumns = ({
  selectedMetrics,
  selectedDimensions,
  dimensionFilter,
  property = "properties/0",
}) => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = useMemo(() => gapi?.client.analyticsdata, [gapi])
  const [metrics, setMetrics] = React.useState<GA4Metrics>()
  const [dimensions, setDimensions] = React.useState<GA4Dimensions>()

  useEffect(() => {
    if (dataAPI === undefined) {
      return
    }
    dataAPI.properties
      .getMetadata({ name: `${property}/metadata` })
      .then(response => {
        const { dimensions, metrics } = response.result
        setMetrics(metrics)
        setDimensions(dimensions)
      })
  }, [dataAPI, property])

  const selectedMetricIds = React.useMemo(() => {
    return new Set((selectedMetrics || []).map(metric => metric.apiName))
  }, [selectedMetrics])

  const metricOptions = React.useMemo(() => {
    return metrics?.filter(metric => !selectedMetricIds.has(metric.apiName))
  }, [metrics, selectedMetricIds])

  const selectedDimensionIds = React.useMemo(() => {
    return new Set(
      (selectedDimensions || []).map(dimension => dimension.apiName)
    )
  }, [selectedDimensions])

  const dimensionOptions = React.useMemo(() => {
    return dimensions
      ?.filter(dimension => !selectedDimensionIds.has(dimension.apiName))
      .filter(dimensionFilter || (() => true))
  }, [dimensions, selectedDimensionIds, dimensionFilter])

  return { metricOptions, dimensionOptions }
}

export type GA4Dimension = gapi.client.analyticsdata.DimensionMetadata
export type GA4Dimensions = GA4Dimension[] | undefined
type GA4Metric = gapi.client.analyticsdata.MetricMetadata
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

export const DimensionsPicker: React.FC<{
  storageKey: StorageKey
  setDimensions: React.Dispatch<React.SetStateAction<GA4Dimensions>>
  property?: string
  required?: true | undefined
  helperText?: string | JSX.Element
  label?: string
}> = ({
  helperText,
  setDimensions,
  required,
  storageKey,
  property,
  label = "dimensions",
}) => {
  const [selected, setSelected] = usePersistantObject<
    NonNullable<GA4Dimensions>
  >(storageKey)
  const { dimensionOptions } = useAvailableColumns({
    selectedDimensions: selected,
    selectedMetrics: [],
    property,
  })

  React.useEffect(() => {
    setDimensions(selected)
  }, [selected, setDimensions])

  return (
    <Autocomplete<NonNullable<GA4Dimension>, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      options={dimensionOptions || []}
      getOptionLabel={dimension => dimension.apiName!}
      value={selected || []}
      onChange={(_event, value) =>
        value.length === 0
          ? setSelected(undefined)
          : setSelected(value as GA4Dimensions)
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

export const MetricsPicker: React.FC<{
  storageKey: StorageKey
  setMetrics: React.Dispatch<React.SetStateAction<GA4Metrics>>
  property?: string
  required?: true | undefined
  helperText?: string | JSX.Element
  label?: string
}> = ({
  helperText,
  setMetrics,
  required,
  storageKey,
  property,
  label = "metrics",
}) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<GA4Metrics>>(
    storageKey
  )
  const { metricOptions } = useAvailableColumns({
    selectedMetrics: selected,
    selectedDimensions: [],
    property,
  })

  React.useEffect(() => {
    setMetrics(selected)
  }, [selected, setMetrics])

  return (
    <Autocomplete<NonNullable<GA4Metric>, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      options={metricOptions || []}
      getOptionLabel={metric => metric.apiName!}
      value={selected || []}
      onChange={(_event, value) =>
        value.length === 0
          ? setSelected(undefined)
          : setSelected(value as GA4Metrics)
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

export const DimensionPicker: React.FC<{
  setDimension: Dispatch<GA4Dimension | undefined>
  dimensionFilter?: (dimension: GA4Dimension) => boolean
  property?: string
  required?: true | undefined
  helperText?: string | JSX.Element
  label?: string
  className?: string
}> = ({
  helperText,
  setDimension,
  required,
  property,
  dimensionFilter,
  className,
  label = "dimensions",
}) => {
  const [selected, setSelected] = useState<GA4Dimension>()
  const { dimensionOptions } = useAvailableColumns({
    selectedDimensions: selected === undefined ? [] : [selected],
    selectedMetrics: [],
    property,
    dimensionFilter,
  })

  React.useEffect(() => {
    setDimension(selected)
  }, [selected, setDimension])

  return (
    <Autocomplete<NonNullable<GA4Dimension>, false, undefined, true>
      className={className}
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={dimensionOptions || []}
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
