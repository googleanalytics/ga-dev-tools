import { useState, useMemo, useCallback } from "react"

import { usePersistentString } from "@/hooks"
import { StorageKey } from "@/constants"
import { V4SamplingLevel } from "@/components/UAPickers"
import { UAAccountPropertyView } from "@/components/ViewSelector/useAccountPropertyView"
import {
  useKeyedHydratedPersistantArray,
  useKeyedHydratedPersistantObject,
} from "@/hooks/useHydrated"
import { QueryParam } from "../RequestComposer"
import { Column, Segment } from "@/types/ua"

const useMetricExpressionRequestParameters = (
  apv: UAAccountPropertyView,
  columns: Column[] | undefined,
  segments: Segment[] | undefined
) => {
  const [viewId, setViewId] = useState("")
  const [startDate, setStartDate] = usePersistentString(
    StorageKey.metricExpressionStartDate,
    "7daysAgo"
  )
  const [endDate, setEndDate] = usePersistentString(
    StorageKey.metricExpressionEndDate,
    "yesterday"
  )
  const [metricExpressions, setMetricExpressions] = usePersistentString(
    StorageKey.metricExpressionMetricExpressions,
    ""
  )
  const [metricAliases, setMetricAliases] = usePersistentString(
    StorageKey.metricExpressionMetricAliases,
    ""
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
  ] = useKeyedHydratedPersistantArray<Column>(
    StorageKey.requestComposerMetricExpressionDimensions,
    QueryParam.Dimensions,
    getColumnsByIDs
  )

  const [filtersExpression, setFiltersExpression] = usePersistentString(
    StorageKey.metricExpressionFiltersExpression,
    ""
  )

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
  ] = useKeyedHydratedPersistantObject<Segment>(
    StorageKey.requestComposerMetricExpressionSegment,
    QueryParam.Segment,
    getSegmentByID
  )

  const [samplingLevel, setSamplingLevel] = useState<
    V4SamplingLevel | undefined
  >(V4SamplingLevel.Default)
  const [pageToken, setPageToken] = usePersistentString(
    StorageKey.metricExpressionPageToken
  )
  const [pageSize, setPageSize] = usePersistentString(
    StorageKey.metricExpressionPageSize
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
    metricExpressions,
    setMetricExpressions,
    metricAliases,
    setMetricAliases,
    selectedDimensions,
    setSelectedDimensionIDs,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
    pageToken,
    setPageToken,
    pageSize,
    setPageSize,
  }
}

export default useMetricExpressionRequestParameters
