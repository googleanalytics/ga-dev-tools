import { HasView } from "../../../components/ViewSelector"
import { useState, useEffect, useMemo } from "react"
import { Column, Segment, SamplingLevel } from "../_api"
import { StorageKey } from "../../../constants"

const useHistogramRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<Column[]>([])
  const [samplingLevel, setSamplingLevel] = useState<SamplingLevel>()

  const [startDate, setStartDate] = useState(() => {
    const startDate = window.localStorage.getItem(StorageKey.histogramStartDate)
    return startDate || "7daysAgo"
  })
  // Keep the startDate value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(StorageKey.histogramStartDate, startDate)
  }, [startDate])

  const [endDate, setEndDate] = useState(() => {
    const endDate = window.localStorage.getItem(StorageKey.histogramEndDate)
    return endDate || "yesterday"
  })
  // Keep the endDate value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(StorageKey.histogramEndDate, endDate)
  }, [endDate])

  const [buckets, setBuckets] = useState(() => {
    const buckets = window.localStorage.getItem(StorageKey.histogramBuckets)
    return buckets || ""
  })
  // Keep the histogram bucket value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(StorageKey.histogramBuckets, buckets)
  }, [buckets])

  const [filtersExpression, setFiltersExpression] = useState(() => {
    const filtersExpression = window.localStorage.getItem(
      StorageKey.histogramFiltersExpression
    )
    return filtersExpression || ""
  })
  // Keep the histogram filters expression value in sync with localStorage.
  useEffect(() => {
    window.localStorage.setItem(
      StorageKey.histogramFiltersExpression,
      filtersExpression
    )
  }, [filtersExpression])

  const [selectedSegment, setSelectedSegment] = useState<Segment>()

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
