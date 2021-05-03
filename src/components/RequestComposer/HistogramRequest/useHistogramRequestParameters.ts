import { useState, useMemo } from "react"

import { usePersistentString } from "@/hooks"
import { StorageKey } from "@/constants"
import { HasView } from "@/components/ViewSelector"
import {
  V4SamplingLevel,
  UADimensions,
  UAMetrics,
  UASegment,
} from "@/components/UAPickers"

const useHistogramRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedDimensions, setSelectedDimensions] = useState<UADimensions>()
  const [selectedMetrics, setSelectedMetrics] = useState<UAMetrics>()
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
  const [selectedSegment, setSelectedSegment] = useState<UASegment>()

  useMemo(() => {
    const id = view?.view.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [view])

  return {
    viewId,
    setViewId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedDimensions,
    setSelectedDimensions,
    selectedMetrics,
    setSelectedMetrics,
    buckets,
    setBuckets,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
  }
}

export default useHistogramRequestParameters
