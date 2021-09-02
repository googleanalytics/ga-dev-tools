import * as React from "react"

import { StorageKey } from "@/constants"
import { V3SamplingLevel } from "@/components/UAPickers"
import { QueryParam, SortableColumn } from "."
import {
  useHydratedPersistantBoolean,
  useHydratedPersistantString,
  useKeyedHydratedPersistantArray,
  useKeyedHydratedPersistantObject,
} from "@/hooks/useHydrated"
import { Dispatch, RequestStatus } from "@/types"
import { Column, Segment } from "@/types/ua"
import useUADimensionsAndMetrics from "../UAPickers/useDimensionsAndMetrics"
import { useUASegments } from "../UAPickers/useUASegments"

export const useInputs = (
  uaDimensionsAndMetricsRequest: ReturnType<typeof useUADimensionsAndMetrics>,
  uaSegmentsRequest: ReturnType<typeof useUASegments>
) => {
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

  const getSegmentByID = React.useCallback(
    (id: string | undefined) => {
      if (
        id === undefined ||
        uaSegmentsRequest.status !== RequestStatus.Successful
      ) {
        return undefined
      }
      const builtInSegment = uaSegmentsRequest.segments.find(s => s.id === id)
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
    [uaSegmentsRequest]
  )

  const [segment, setSegmentID] = useKeyedHydratedPersistantObject<Segment>(
    StorageKey.queryExplorerSegment,
    QueryParam.Segment,
    getSegmentByID
  )

  const getColumnsByIDs = React.useCallback(
    (ids: string[] | undefined) => {
      if (
        uaDimensionsAndMetricsRequest.status !== RequestStatus.Successful ||
        ids === undefined
      ) {
        return undefined
      }
      return uaDimensionsAndMetricsRequest.columns.filter(c =>
        ids.includes(c.id!)
      )
    },
    [uaDimensionsAndMetricsRequest]
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
      if (
        uaDimensionsAndMetricsRequest.status !== RequestStatus.Successful ||
        ids === undefined
      ) {
        return undefined
      }
      return uaDimensionsAndMetricsRequest.columns
        .flatMap<SortableColumn>(c => [
          { ...c, sort: "ASCENDING" },
          { ...c, sort: "DESCENDING" },
        ])
        .filter(
          c =>
            ids.find(id => {
              if (id.includes("@@@")) {
                // TODO - add measurement to see if this branch is reached.
                const [innerId, type] = id.split("@@@")
                return c.id === innerId && type === c.sort
              }
              if (id.startsWith("-")) {
                const actualId = id.substring(1)
                return c.id === actualId && c.sort === "DESCENDING"
              }
              return c.id === id && c.sort === "ASCENDING"
            }) !== undefined
        )
    },
    [uaDimensionsAndMetricsRequest]
  )

  const [sort, setSortIDs] = useKeyedHydratedPersistantArray<SortableColumn>(
    StorageKey.queryExplorerSort,
    QueryParam.Sort,
    getSortByIDs
  )

  return {
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
