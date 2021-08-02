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
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete"
import { usePersistantObject, usePersistentString } from "../hooks"
import { StorageKey } from "../constants"
import { useSelector } from "react-redux"
import { Column as ColumnT } from "@/api"
import { HasView } from "./ViewSelector"

export type UADimensions = UAColumns | undefined
export type UAMetrics = UAColumns | undefined
export type UADimension = UAColumn | undefined
export type UAMetric = UAColumn | undefined
export type UASegment = gapi.client.analytics.Segment
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

type UseUADimensionsAndMetrics = (
  view: HasView | undefined
) => {
  dimensions: UADimensions
  metrics: UAMetrics
  columns: UAColumns | undefined
}
const useUADimensionsAndMetrics: UseUADimensionsAndMetrics = view => {
  const gapi = useSelector((state: AppState) => state.gapi)

  const metadataAPI = React.useMemo<MetadataAPI | undefined>(() => {
    return gapi?.client.analytics.metadata as any
  }, [gapi])

  const managementAPI = React.useMemo<ManagementAPI | undefined>(() => {
    return gapi?.client.analytics.management as any
  }, [gapi])

  const [
    withEtag,
    setUAColumnsWithEtag,
  ] = usePersistantObject<UAColumnsWithEtag>(StorageKey.uaColumns)

  const [customMetrics, setCustomMetrics] = usePersistantObject<
    gapi.client.analytics.CustomMetric[]
  >(StorageKey.uaCustomMetrics)

  const [customDimensions, setCustomDimensions] = usePersistantObject<
    gapi.client.analytics.CustomDimension[]
  >(StorageKey.uaCustomDimensions)

  const [goals, setGoals] = React.useState<gapi.client.analytics.Goal[]>()

  React.useEffect(() => {
    if (managementAPI === undefined || view === undefined) {
      return
    }
    Promise.all([
      managementAPI.customDimensions.list({
        accountId: view.account.id!,
        webPropertyId: view.property.id!,
      }),
      managementAPI.customMetrics.list({
        accountId: view.account.id!,
        webPropertyId: view.property.id!,
      }),
      managementAPI.goals.list({
        accountId: view.account.id!,
        webPropertyId: view.property.id!,
        profileId: view.view.id!,
      }),
    ]).then(results => {
      const dimensions = results[0].result.items
      const metrics = results[1].result.items
      const goals = results[2].result.items
      setCustomMetrics(old => {
        if (
          old !== undefined &&
          metrics !== undefined &&
          old.length === metrics.length
        ) {
          if (old.every((a, idx) => a.id === metrics[idx].id)) {
            return old
          }
        }
        return metrics
      })
      setCustomDimensions(old => {
        if (
          old !== undefined &&
          dimensions !== undefined &&
          old.length === dimensions.length
        ) {
          if (old.every((a, idx) => a.id === dimensions[idx].id)) {
            return old
          }
        }
        return dimensions
      })
      setGoals(old => {
        if (
          old !== undefined &&
          goals !== undefined &&
          old.length === goals.length
        ) {
          if (old.every((a, idx) => a.id === goals[idx].id)) {
            return old
          }
        }
        return goals
      })
    })
  }, [managementAPI, view, setCustomDimensions, setCustomMetrics, setGoals])

  React.useEffect(() => {
    if (metadataAPI === undefined) {
      return
    }
    metadataAPI.columns.list({ reportType: "ga" }).then(response => {
      const etag = response.result.etag!
      setUAColumnsWithEtag(old => {
        const columns = response.result.items!
        if (old?.etag === etag) {
          return old
        }
        return { etag, columns }
      })
    })
  }, [metadataAPI, setUAColumnsWithEtag])

  const withEnumerated = React.useMemo(() => {
    return withEtag?.columns.flatMap(column => {
      if (customDimensions !== undefined && column.id === "ga:dimensionXX") {
        return customDimensions.map(
          dimension =>
            ({
              ...column,
              id: dimension.id,
              attributes: { ...column.attributes, uiName: dimension.name },
            } as ColumnT)
        )
      }
      if (customMetrics !== undefined && column.id === "ga:metricXX") {
        return customMetrics.map(
          metric =>
            ({
              ...column,
              id: metric.id,
              attributes: { ...column.attributes, uiName: metric.name },
            } as ColumnT)
        )
      }
      if (
        goals !== undefined &&
        column.attributes!.minTemplateIndex !== undefined &&
        /goalxx/i.test(column.id!)
      ) {
        return goals.map(goal => ({
          ...column,
          id: column.id!.replace("XX", goal.id!),
          attributes: {
            ...column.attributes,
            uiName: `${goal.name} (${column.attributes!.uiName.replace(
              "XX",
              goal.id!
            )})`,
          },
        }))
      }
      if (column.attributes!.minTemplateIndex !== undefined) {
        let min = 0
        let max = 0
        if (
          view?.property.level === "PREMIUM" &&
          column.attributes!.premiumMinTemplateIndex !== undefined
        ) {
          min = parseInt(column.attributes!.premiumMinTemplateIndex, 10)
          max = parseInt(column.attributes!.premiumMaxTemplateIndex, 10)
        } else {
          min = parseInt(column.attributes!.minTemplateIndex, 10)
          max = parseInt(column.attributes!.maxTemplateIndex, 10)
        }
        const columns: gapi.client.analytics.Column[] = []
        for (let i = min; i <= max; i++) {
          columns.push({
            ...column,
            id: column.id!.replace("XX", i.toString()),
            attributes: {
              ...column.attributes,
              uiName: column.attributes!.uiName.replace("XX", i.toString()),
            },
          })
        }
        return columns
      }
      return [column]
    })
  }, [customDimensions, customMetrics, withEtag, goals, view?.property.level])

  const dimensions = React.useMemo<UADimensions>(
    () =>
      withEnumerated?.filter(column => column.attributes?.type === "DIMENSION"),
    [withEnumerated]
  )

  const metrics = React.useMemo(
    () =>
      withEnumerated?.filter(column => column.attributes?.type === "METRIC"),
    [withEnumerated]
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
  view: HasView | undefined
}> = ({ helperText, setDimension, required, storageKey, view }) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UADimension>>(
    storageKey
  )
  const { dimensions } = useUADimensionsAndMetrics(view)
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
  view: HasView | undefined
}> = ({
  helperText,
  setDimensions,
  required,
  storageKey,
  view,
  label = "dimensions",
}) => {
  const [selected, setSelected] = usePersistantObject<
    NonNullable<UADimensions>
  >(storageKey)
  const { dimensions } = useUADimensionsAndMetrics(view)
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
  view: HasView | undefined
  filter?: (metric: NonNullable<UAMetric>) => boolean
}> = ({ helperText, setMetric, required, storageKey, filter, view }) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UAMetric>>(
    storageKey
  )
  const { metrics } = useUADimensionsAndMetrics(view)
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
  view: HasView | undefined
}> = ({
  helperText,
  setMetrics,
  required,
  storageKey,
  label = "metrics",
  view,
}) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UAMetrics>>(
    storageKey
  )
  const { metrics } = useUADimensionsAndMetrics(view)
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
  segments: UASegment[] | undefined
}
const useUASegments: UseUASegments = () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const api = React.useMemo<ManagementAPI | undefined>(() => {
    return gapi?.client.analytics.management as any
  }, [gapi])
  const [
    withEtag,
    setUASegmentsWithEtag,
  ] = usePersistantObject<UASegmentsWithEtag>(StorageKey.uaSegments)
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
  segment: UASegment
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

const filter = createFilterOptions<UASegment>()
export const SegmentPicker: React.FC<{
  storageKey: StorageKey
  setSegment: React.Dispatch<React.SetStateAction<UASegment | undefined>>
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
    <Autocomplete<UASegment, false, undefined, true>
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
      filterOptions={(options, params) => {
        const filtered = filter(options || [], params)

        // Add entry for creating a dynamic segment based on input.
        if (params.inputValue !== "") {
          filtered.push({
            definition: params.inputValue,
            name: `Add dynamic segment`,
            segmentId: params.inputValue,
            type: "DYNAMIC",
          })
        }
        return filtered
      }}
      onChange={(_event, value) => {
        setSelected(value === null ? undefined : (value as UASegment))
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
