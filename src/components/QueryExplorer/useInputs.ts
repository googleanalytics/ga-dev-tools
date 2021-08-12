import * as React from "react"

import { Segment, Column } from "@/api"
import { StorageKey } from "@/constants"
import { useUASegments, V3SamplingLevel } from "@/components/UAPickers"
import { SortableColumn } from "."
import {
  useHydratedPersistantBoolean,
  useHydratedPersistantString,
  useKeyedHydratedPersistantArray,
  useKeyedHydratedPersistantObject,
} from "@/hooks/useHydrated"
import { Dispatch } from "@/types"
import useAccountPropertyView from "../ViewSelector/useAccountPropertyView"

export enum QueryParam {
  Account = "a",
  Property = "b",
  View = "c",
  ShowSegmentDefinitions = "d",
  ViewID = "ids",
  StartDate = "start-date",
  EndDate = "end-date",
  SelectedMetrics = "metrics",
  SelectedDimensions = "dimensions",
  Sort = "sort",
  Filters = "filters",
  Segment = "segment",
  SamplingLevel = "samplingLevel",
  StartIndex = "start-index",
  MaxResults = "max-results",
  IncludeEmptyRows = "include-empty-rows",
}

export const useInputs = ({
  view,
  columns,
}: ReturnType<typeof useAccountPropertyView> & {
  columns: Column[] | undefined
}) => {
  const [viewID, setViewID] = useHydratedPersistantString(
    StorageKey.queryExplorerViewID,
    QueryParam.ViewID,
    view === undefined ? undefined : `ga:${view.id}`
  )

  React.useEffect(() => {
    if (view !== undefined) {
      setViewID(`ga:${view!.id}`)
    }
  }, [view, setViewID])

  const [startDate, setStartDate] = useHydratedPersistantString(
    StorageKey.queryExplorerStartDate,
    QueryParam.StartDate,
    "7daysAgo"
  )
  const [endDate, setEndDate] = useHydratedPersistantString(
    StorageKey.queryExplorerEndDate,
    QueryParam.EndDate,
    "yesterday"
  )
  const [startIndex, setStartIndex] = useHydratedPersistantString(
    StorageKey.queryExplorerStartIndex,
    QueryParam.StartIndex
  )
  const [maxResults, setMaxResults] = useHydratedPersistantString(
    StorageKey.queryExplorerMaxResults,
    QueryParam.MaxResults
  )
  const [filters, setFilters] = useHydratedPersistantString(
    StorageKey.queryExplorerFilters,
    QueryParam.Filters
  )

  const segments = useUASegments()

  const getSegmentByID = React.useCallback(
    (id: string | undefined) => {
      if (id === undefined || segments === undefined) {
        return undefined
      }
      const builtInSegment = segments.find(s => s.id === id)
      if (builtInSegment !== undefined) {
        return builtInSegment
      }
      // If the segment wasn't in the list of segments returned by the API,
      // this was a custom (dynamic) segment defined by the user.
      return {
        definition: id,
        name: `Add dynamic segment`,
        segmentId: id,
        id,
        type: "DYNAMIC",
      }
    },
    [segments]
  )

  const [segment, setSegmentID] = useKeyedHydratedPersistantObject<Segment>(
    StorageKey.queryExplorerSegment,
    QueryParam.Segment,
    getSegmentByID
  )

  const getColumnsByIDs = React.useCallback(
    (ids: string[] | undefined) => {
      if (columns === undefined || ids === undefined) {
        return undefined
      }
      return columns.filter(c => ids.includes(c.id!))
    },
    [columns]
  )

  const [
    selectedMetrics,
    setSelectedMetricIDs,
  ] = useKeyedHydratedPersistantArray<Column>(
    StorageKey.queryExplorerSelectedMetrics,
    QueryParam.SelectedMetrics,
    getColumnsByIDs
  )

  const [
    selectedDimensions,
    setSelectedDimensionIDs,
  ] = useKeyedHydratedPersistantArray<Column>(
    StorageKey.queryExplorerSelectedDimensions,
    QueryParam.SelectedDimensions,
    getColumnsByIDs
  )

  const [includeEmptyRows, setIncludeEmptyRows] = useHydratedPersistantBoolean(
    StorageKey.queryExplorerIncludeEmptyRows,
    QueryParam.IncludeEmptyRows,
    true
  )
  const [
    showSegmentDefinition,
    setShowSegmentDefiniton,
  ] = useHydratedPersistantBoolean(
    StorageKey.queryExplorerShowSegmentDefinition,
    QueryParam.ShowSegmentDefinitions,
    false
  )
  const [
    samplingValueLocal,
    setSamplingValueLocal,
  ] = useHydratedPersistantString(
    StorageKey.queryExplorerSamplingLevel,
    QueryParam.SamplingLevel,
    V3SamplingLevel.Default
  )

  const samplingValue = React.useMemo(
    () => samplingValueLocal as V3SamplingLevel | undefined,
    [samplingValueLocal]
  )

  const setSamplingValue: Dispatch<
    V3SamplingLevel | undefined
  > = React.useCallback(
    a => {
      setSamplingValueLocal(a as any)
    },
    [setSamplingValueLocal]
  )

  const getSortByIDs = React.useCallback(
    (ids: string[] | undefined) => {
      if (columns === undefined || ids === undefined) {
        return undefined
      }
      return columns
        .flatMap<SortableColumn>(c => [
          { ...c, sort: "ASCENDING" },
          { ...c, sort: "DESCENDING" },
        ])
        .filter(
          c =>
            ids.find(id => {
              const [innerId, type] = id.split("@@@")
              return c.id === innerId && type === c.sort
            }) !== undefined
        )
    },
    [columns]
  )

  const [sort, setSortIDs] = useKeyedHydratedPersistantArray<SortableColumn>(
    StorageKey.queryExplorerSort,
    QueryParam.Sort,
    getSortByIDs
  )

  return {
    viewID,
    setViewID,
    sort,
    setSortIDs,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startIndex,
    setStartIndex,
    maxResults,
    setMaxResults,
    filters,
    setFilters,
    segment,
    setSegmentID,
    selectedMetrics,
    setSelectedMetricIDs,
    selectedDimensions,
    setSelectedDimensionIDs,
    includeEmptyRows,
    setIncludeEmptyRows,
    showSegmentDefinition,
    setShowSegmentDefiniton,
    samplingValue,
    setSamplingValue,
  }
}

export default useInputs
