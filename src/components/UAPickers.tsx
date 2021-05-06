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

// TODO - also persist choices per ga:id, instead of per demo
// TODO - Add a picker for Sort that uses Column

import * as React from "react"

import { Typography, TextField, makeStyles } from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { usePersistantObject, usePersistentString } from "../hooks"
import { StorageKey } from "../constants"
import { useSelector } from "react-redux"

export type UADimensions = UAColumns | undefined
export type UAMetrics = UAColumns | undefined
export type UADimension = UAColumn | undefined
export type UAMetric = UAColumn | undefined
export type UASegment = gapi.client.analytics.Segment | undefined
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

type UASegments = gapi.client.analytics.Segment[] | undefined
type UAColumn = gapi.client.analytics.Column
type UAColumns = UAColumn[]
type MetadataAPI = typeof gapi.client.analytics.metadata
interface UAColumnsWithEtag {
  columns: UAColumns
  etag: string
}
type ManagementAPI = typeof gapi.client.analytics.management
interface UASegmentsWithEtag {
  segments: UASegments
  etag: string
}

type UseUADimensionsAndMetrics = () => {
  dimensions: UADimensions
  metrics: UAMetrics
  columns: UAColumns | undefined
}
const useUADimensionsAndMetrics: UseUADimensionsAndMetrics = () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const api = React.useMemo<MetadataAPI | undefined>(() => {
    return gapi?.client.analytics.metadata as any
  }, [gapi])
  const [withEtag, setUAColumnsWithEtag] = usePersistantObject<
    UAColumnsWithEtag
  >(StorageKey.uaDimensions)
  React.useEffect(() => {
    if (api === undefined) {
      return
    }
    api.columns.list({ reportType: "ga" }).then(response => {
      const etag = response.result.etag!
      setUAColumnsWithEtag(old => {
        const columns = response.result.items!
        if (old?.etag === etag) {
          // TODO I need to double check, but I think this prevents re-renders
          return old
        }
        return { etag, columns }
      })
    })
  }, [api, setUAColumnsWithEtag])

  const dimensions = React.useMemo<UADimensions>(
    () =>
      withEtag?.columns.filter(
        column => column.attributes?.type === "DIMENSION"
      ),
    [withEtag]
  )

  const metrics = React.useMemo(
    () =>
      withEtag?.columns.filter(column => column.attributes?.type === "METRIC"),
    [withEtag]
  )

  const columns = React.useMemo(() => withEtag?.columns, [withEtag])

  return { dimensions, metrics, columns }
}

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

const Column: React.FC<{ column: UAColumn }> = ({ column }) => {
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

export const DimensionPicker: React.FC<{
  storageKey: StorageKey
  setDimension: React.Dispatch<React.SetStateAction<UADimension>>
  required?: true | undefined
  helperText?: string
}> = ({ helperText, setDimension, required, storageKey }) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UADimension>>(
    storageKey
  )
  const { dimensions } = useUADimensionsAndMetrics()
  const dimensionOptions = React.useMemo<UADimensions>(() => dimensions, [
    dimensions,
  ])

  React.useEffect(() => {
    setDimension(selected)
  }, [selected, setDimension])

  return (
    <Autocomplete<NonNullable<UADimension>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={dimensionOptions || []}
      getOptionLabel={dimension => dimension.id!}
      value={selected || null}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as UADimension))
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
  storageKey: StorageKey
  setDimensions: React.Dispatch<React.SetStateAction<UADimensions>>
  required?: true | undefined
  helperText?: string
  label?: string
}> = ({
  helperText,
  setDimensions,
  required,
  storageKey,
  label = "dimensions",
}) => {
  const [selected, setSelected] = usePersistantObject<
    NonNullable<UADimensions>
  >(storageKey)
  const { dimensions } = useUADimensionsAndMetrics()
  const dimensionOptions = React.useMemo<UADimensions>(
    () =>
      dimensions?.filter(
        option => (selected || []).find(s => s.id === option.id) === undefined
      ),
    [dimensions, selected]
  )

  React.useEffect(() => {
    setDimensions(selected)
  }, [selected, setDimensions])

  return (
    <Autocomplete<NonNullable<UADimension>, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      options={dimensionOptions || []}
      getOptionLabel={dimension => dimension.id!}
      value={selected || []}
      onChange={(_event, value) => setSelected(value as UADimensions)}
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
  storageKey: StorageKey
  setMetric: React.Dispatch<React.SetStateAction<UAMetric>>
  required?: true | undefined
  helperText?: string
  filter?: (metric: NonNullable<UAMetric>) => boolean
}> = ({ helperText, setMetric, required, storageKey, filter }) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UAMetric>>(
    storageKey
  )
  const { metrics } = useUADimensionsAndMetrics()
  const metricOptions = React.useMemo<UAMetrics>(
    () => metrics?.filter(filter !== undefined ? filter : () => true),
    [metrics, filter]
  )

  React.useEffect(() => {
    setMetric(selected)
  }, [selected, setMetric])

  return (
    <Autocomplete<NonNullable<UAMetric>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={metricOptions || []}
      getOptionLabel={metric => metric.id!}
      value={selected || null}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as UAMetric))
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
  storageKey: StorageKey
  setMetrics: React.Dispatch<React.SetStateAction<UAMetrics>>
  required?: true | undefined
  helperText?: string
  label?: string
}> = ({ helperText, setMetrics, required, storageKey, label = "metrics" }) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UAMetrics>>(
    storageKey
  )
  const { metrics } = useUADimensionsAndMetrics()
  const metricOptions = React.useMemo<UAMetrics>(
    () =>
      metrics?.filter(
        option => (selected || []).find(s => s.id === option.id) === undefined
      ),
    [metrics, selected]
  )

  React.useEffect(() => {
    setMetrics(selected)
  }, [selected, setMetrics])

  return (
    <Autocomplete<NonNullable<UAMetric>, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      options={metricOptions || []}
      getOptionLabel={metric => metric.id!}
      value={selected || []}
      onChange={(_event, value) => setSelected(value as UAMetrics)}
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

type UseUASegments = () => {
  segments: UASegments
}
const useUASegments: UseUASegments = () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const api = React.useMemo<ManagementAPI | undefined>(() => {
    return gapi?.client.analytics.management as any
  }, [gapi])
  const [withEtag, setUASegmentsWithEtag] = usePersistantObject<
    UASegmentsWithEtag
  >(StorageKey.uaSegments)
  React.useEffect(() => {
    if (api === undefined) {
      return
    }
    api.segments.list({}).then(response => {
      // TODO - There's probably a cleaner way of handling this, but this works
      // since the method doesn't actually return an etag.
      const etag = JSON.stringify(response.result.items || [])
      setUASegmentsWithEtag(old => {
        const segments = response.result.items!
        if (old?.etag === etag) {
          // TODO I need to double check, but I think this prevents re-renders
          return old
        }
        return { etag, segments }
      })
    })
  }, [api, setUASegmentsWithEtag])

  const segments = React.useMemo<UADimensions>(() => withEtag?.segments, [
    withEtag,
  ])

  return { segments }
}

const Segment: React.FC<{
  segment: NonNullable<UASegment>
  showSegmentDefinition: boolean
}> = ({ segment, showSegmentDefinition }) => {
  const classes = useColumnStyles()
  const subtitleText = showSegmentDefinition
    ? segment.definition || `${segment.name} has no segment definition.`
    : segment!.segmentId!
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
        {segment.type === "CUSTOM" ? "Custom Segment" : "Built In Segment"}
      </Typography>
    </div>
  )
}

export const SegmentPicker: React.FC<{
  storageKey: StorageKey
  setSegment: React.Dispatch<React.SetStateAction<UASegment>>
  showSegmentDefinition: boolean
  required?: true | undefined
  helperText?: string
}> = ({
  helperText,
  setSegment,
  required,
  storageKey,
  showSegmentDefinition,
}) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UASegment>>(
    storageKey
  )
  const { segments } = useUASegments()
  const value = React.useMemo(
    () => (showSegmentDefinition ? { ...selected } : { ...selected }),
    [selected, showSegmentDefinition]
  )

  React.useEffect(() => {
    setSegment(selected)
  }, [selected, setSegment])

  return (
    <Autocomplete<NonNullable<UASegment>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={segments || []}
      getOptionLabel={segment =>
        (showSegmentDefinition
          ? segment.definition ||
            (segment.name && `${segment.name} has no segment definiton.`)
          : segment.segmentId!) || ""
      }
      value={value || null}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as UASegment))
      }
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
  storageKey: StorageKey
  setSamplingLevel: React.Dispatch<
    React.SetStateAction<V3SamplingLevel | undefined>
  >
  required?: true | undefined
  helperText?: string
}> = ({ helperText, setSamplingLevel, required, storageKey }) => {
  const [selected, setSelected] = usePersistentString(storageKey)

  React.useEffect(() => {
    setSamplingLevel(selected as V3SamplingLevel)
  }, [selected, setSamplingLevel])

  return (
    <Autocomplete<NonNullable<V3SamplingLevel>, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={Object.values(V3SamplingLevel)}
      getOptionLabel={segment => segment}
      value={selected || null}
      onChange={(_event, value) =>
        setSelected(value === null ? undefined : (value as V3SamplingLevel))
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
