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
import { usePersistantObject, usePersistentString } from "../hooks"
import { StorageKey } from "../constants"
import { useSelector } from "react-redux"
import { AccountSummary, Column as ColumnT, WebPropertySummary } from "@/api"
import { ProfileSummary } from "./ViewSelector/useViewSelector"
import { Dispatch } from "@/types"
import useCached from "@/hooks/useCached"
import moment from "moment"

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

type UAColumn = gapi.client.analytics.Column
type UAColumns = UAColumn[]
type MetadataAPI = typeof gapi.client.analytics.metadata
type ManagementAPI = typeof gapi.client.analytics.management

type Arg = {
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
}

type UseUADimensionsAndMetrics = (
  arg: Arg
) => {
  dimensions: UADimensions
  metrics: UAMetrics
  columns: UAColumns | undefined
}
// TODO add in useCached here.
export const useUADimensionsAndMetrics: UseUADimensionsAndMetrics = ({
  account,
  property,
  view,
}) => {
  const gapi = useSelector((state: AppState) => state.gapi)

  const metadataAPI = React.useMemo<MetadataAPI | undefined>(() => {
    return gapi?.client.analytics.metadata as any
  }, [gapi])

  const managementAPI = React.useMemo<ManagementAPI | undefined>(() => {
    return gapi?.client.analytics.management as any
  }, [gapi])

  const makeRequest = React.useCallback(async () => {
    if (
      metadataAPI === undefined ||
      managementAPI === undefined ||
      account === undefined ||
      property === undefined ||
      view === undefined
    ) {
      return Promise.resolve(undefined)
    }
    const columnsResponse = await metadataAPI.columns.list({ reportType: "ga" })
    const columns = columnsResponse.result.items

    const [
      customDimensionsResponse,
      customMetricsResponse,
      goalsResponse,
    ] = await Promise.all([
      managementAPI.customDimensions.list({
        accountId: account.id!,
        webPropertyId: property.id!,
      }),
      managementAPI.customMetrics.list({
        accountId: account.id!,
        webPropertyId: property.id!,
      }),
      managementAPI.goals.list({
        accountId: account.id!,
        webPropertyId: property.id!,
        profileId: view.id!,
      }),
    ])

    const customDimensions = customDimensionsResponse.result.items
    const customMetrics = customMetricsResponse.result.items
    const goals = goalsResponse.result.items

    return columns?.flatMap(column => {
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
          property?.level === "PREMIUM" &&
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
  }, [metadataAPI, managementAPI, account, property, view])

  const columns = useCached(
    // Even though account is sometimes undefined it doesn't really matter
    // since this hook will re-run once it is. makeRequest is smartEnough to
    // not do anything when account property or view are undefined.
    `//ua-dims-mets/${account?.id}-${property?.id}-${view?.id}` as StorageKey,
    makeRequest,
    moment.duration(5, "minutes")
  )

  const dimensions = React.useMemo<UADimensions>(
    () => columns?.filter(column => column.attributes?.type === "DIMENSION"),
    [columns]
  )

  const metrics = React.useMemo(
    () => columns?.filter(column => column.attributes?.type === "METRIC"),
    [columns]
  )

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
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
}> = ({
  helperText,
  setDimension,
  required,
  storageKey,
  account,
  property,
  view,
}) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UADimension>>(
    storageKey
  )
  const { dimensions } = useUADimensionsAndMetrics({ account, property, view })
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
  selectedDimensions: ColumnT[] | undefined
  setDimensionIDs: Dispatch<string[] | undefined>
  required?: true | undefined
  helperText?: string
  label?: string
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
}> = ({
  helperText,
  selectedDimensions,
  setDimensionIDs,
  required,
  account,
  property,
  view,
  label = "dimensions",
}) => {
  const { dimensions } = useUADimensionsAndMetrics({ account, property, view })
  const dimensionOptions = React.useMemo<UADimensions>(
    () =>
      dimensions?.filter(
        option =>
          (selectedDimensions || []).find(s => s.id === option.id) === undefined
      ),
    [dimensions, selectedDimensions]
  )

  return (
    <Autocomplete<NonNullable<UADimension>, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      options={dimensionOptions || []}
      getOptionLabel={dimension => dimension.id!}
      value={selectedDimensions || []}
      onChange={(_event, value) =>
        setDimensionIDs((value as UADimensions)?.map(c => c.id!))
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
  storageKey: StorageKey
  setMetric: React.Dispatch<React.SetStateAction<UAMetric>>
  required?: true | undefined
  helperText?: string
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
  filter?: (metric: NonNullable<UAMetric>) => boolean
}> = ({
  helperText,
  setMetric,
  required,
  storageKey,
  filter,
  account,
  property,
  view,
}) => {
  const [selected, setSelected] = usePersistantObject<NonNullable<UAMetric>>(
    storageKey
  )
  const { metrics } = useUADimensionsAndMetrics({ account, property, view })
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
  selectedMetrics: ColumnT[] | undefined
  setMetricIDs: Dispatch<string[] | undefined>
  required?: true | undefined
  helperText?: string
  label?: string
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
}> = ({
  helperText,
  selectedMetrics,
  setMetricIDs,
  required,
  label = "metrics",
  account,
  property,
  view,
}) => {
  const { metrics } = useUADimensionsAndMetrics({ account, property, view })
  const metricOptions = React.useMemo<UAMetrics>(
    () =>
      metrics?.filter(
        option =>
          (selectedMetrics || []).find(s => s.id === option.id) === undefined
      ),
    [metrics, selectedMetrics]
  )

  return (
    <Autocomplete<NonNullable<UAMetric>, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      options={metricOptions || []}
      getOptionLabel={metric => metric.id!}
      value={selectedMetrics || []}
      onChange={(_event, value) =>
        setMetricIDs((value as UAMetrics)?.map(c => c.id!))
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

export const useUASegments = (): UASegment[] | undefined => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const managementAPI = React.useMemo<ManagementAPI | undefined>(() => {
    return gapi?.client.analytics.management as any
  }, [gapi])

  const requestSegments = React.useCallback(async () => {
    if (managementAPI === undefined) {
      return Promise.resolve(undefined)
    }
    const response = await managementAPI.segments.list({})
    return response.result.items
  }, [managementAPI])

  const segments = useCached(
    StorageKey.uaSegments,
    requestSegments,
    moment.duration(5, "minutes")
  )

  return segments
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
  segment: UASegment | undefined
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
  const segments = useUASegments()

  const getOptionLabel = React.useCallback(
    (segment: UASegment) =>
      (showSegmentDefinition
        ? segment.definition ||
          (segment.name && `${segment.name} has no segment definiton.`)
        : segment.segmentId!) || "",
    [showSegmentDefinition]
  )

  return (
    <Autocomplete<UASegment, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={segments || []}
      getOptionSelected={(a, b) =>
        a.id === b.id || a.definition === b.definition
      }
      getOptionLabel={getOptionLabel}
      value={segment || null}
      filterOptions={(options, params) => {
        const filtered = filter(options || [], params)

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
        setSegmentID(value === null ? undefined : (value as UASegment).id)
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
