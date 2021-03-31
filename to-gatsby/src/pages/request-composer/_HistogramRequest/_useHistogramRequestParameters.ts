import { HasView } from "../../../components/ViewSelector"
import { useState, useMemo } from "react"
import { Column, Segment, SamplingLevel } from "../_api"
import { StorageKey } from "../../../constants"
import { usePersistentString } from "../../../hooks"

const useHistogramRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<Column[]>([])
  const [samplingLevel, setSamplingLevel] = useState<SamplingLevel>()

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
