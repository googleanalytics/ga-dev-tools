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

const useHistogramRequestParameters = (
  apv: UAAccountPropertyView,
  columns: Column[] | undefined,
  segments: Segment[] | undefined
) => {
  const [viewId, setViewId] = useState("")

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
    StorageKey.requestComposerHistogramDimensions,
    QueryParam.Dimensions,
    getColumnsByIDs
  )
  const [
    selectedMetrics,
    setSelectedMetricIDs,
  ] = useKeyedHydratedPersistantArray<Column>(
    StorageKey.requestComposerHistogramMetrics,
    QueryParam.Metrics,
    getColumnsByIDs
  )
  const [samplingLevel, setSamplingLevel] = useState<V4SamplingLevel>()

  const [startDate, setStartDate] = usePersistentString(
    StorageKey.histogramStartDate,
    "7daysAgo"
  )
  const [endDate, setEndDate] = usePersistentString(
    StorageKey.histogramEndDate,
    "yesterday"
  )
  const [buckets, setBuckets] = usePersistentString(StorageKey.histogramBuckets)
  const [filtersExpression, setFiltersExpression] = usePersistentString(
    StorageKey.histogramFiltersExpression,
    "ga:browser=~^Chrome"
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
    StorageKey.requestComposerHistogramSegment,
    QueryParam.Segment,
    getSegmentByID
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
    selectedDimensions,
    setSelectedDimensionIDs,
    selectedMetrics,
    setSelectedMetricIDs,
    buckets,
    setBuckets,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
  }
}

export default useHistogramRequestParameters
