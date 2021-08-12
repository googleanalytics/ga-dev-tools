import { useState, useMemo, useCallback } from "react"

import { usePersistentString, usePersistentBoolean } from "@/hooks"
import { StorageKey } from "@/constants"
import {
  V4SamplingLevel,
  UAColumn,
  UASegment,
  useUASegments,
} from "@/components/UAPickers"
import { UAAccountPropertyView } from "@/components/ViewSelector/useAccountPropertyView"
import { QueryParam } from "../RequestComposer"
import {
  useKeyedHydratedPersistantArray,
  useKeyedHydratedPersistantObject,
} from "@/hooks/useHydrated"

const usePivotRequestParameters = (
  apv: UAAccountPropertyView,
  columns: UAColumn[] | undefined
) => {
  const [viewId, setViewId] = useState("")
  const [startDate, setStartDate] = usePersistentString(
    StorageKey.pivotRequestStartDate,
    "7daysAgo"
  )
  const [endDate, setEndDate] = usePersistentString(
    StorageKey.pivotRequestEndDate,
    "yesterday"
  )
  const getColumnsByIDs = useCallback(
    (ids: string[] | undefined) => {
      if (ids === undefined || columns === undefined) {
        return undefined
      }
      return columns.filter(c => ids.includes(c.id!))
    },
    [columns]
  )

  const [
    selectedDimensions,
    setSelectedDimensionIDs,
  ] = useKeyedHydratedPersistantArray<UAColumn>(
    StorageKey.requestComposerPivotDimensions,
    QueryParam.Dimensions,
    getColumnsByIDs
  )
  const [
    selectedMetrics,
    setSelectedMetricIDs,
  ] = useKeyedHydratedPersistantArray<UAColumn>(
    StorageKey.requestComposerPivotMetrics,
    QueryParam.Metrics,
    getColumnsByIDs
  )
  const [
    pivotMetrics,
    setPivotMetricIDs,
  ] = useKeyedHydratedPersistantArray<UAColumn>(
    StorageKey.requestComposerPivotPivotMetrics,
    QueryParam.PivotMetrics,
    getColumnsByIDs
  )
  const [
    pivotDimensions,
    setPivotDimensionIDs,
  ] = useKeyedHydratedPersistantArray<UAColumn>(
    StorageKey.requestComposerPivotPivotDimensions,
    QueryParam.PivotDimensions,
    getColumnsByIDs
  )
  const [startGroup, setStartGroup] = usePersistentString(
    StorageKey.pivotRequestStartGroup
  )
  const [maxGroupCount, setMaxGroupCount] = usePersistentString(
    StorageKey.pivotRequestMaxGroupCount
  )

  const segments = useUASegments()
  const getSegmentByID = useCallback(
    (id: string | undefined) => {
      if (id === undefined || segments === undefined) {
        return undefined
      }
      return segments.find(c => c.id === id)
    },
    [segments]
  )

  const [
    selectedSegment,
    setSelectedSegmentID,
  ] = useKeyedHydratedPersistantObject<UASegment>(
    StorageKey.requestComposerPivotSegment,
    QueryParam.Segment,
    getSegmentByID
  )
  const [samplingLevel, setSamplingLevel] = useState<
    V4SamplingLevel | undefined
  >(V4SamplingLevel.Default)
  const [pageToken, setPageToken] = usePersistentString(
    StorageKey.pivotRequestPageToken
  )
  const [pageSize, setPageSize] = usePersistentString(
    StorageKey.pivotRequestPageSize
  )
  const [includeEmptyRows, setIncludeEmptyRows] = usePersistentBoolean(
    StorageKey.pivotRequestIncludeEmptyRows,
    false
  )

  useMemo(() => {
    const id = apv.view?.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [apv])

  return {
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
    maxGroupCount,
    setMaxGroupCount,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
    includeEmptyRows,
    setIncludeEmptyRows,
    pageToken,
    setPageToken,
    pageSize,
    setPageSize,
  }
}

export default usePivotRequestParameters
