import { useState, useMemo } from "react"
import { HasView } from "../../../components/ViewSelector"
import { Column, Segment, SamplingLevel } from "../_api"
import { usePersistentString } from "../../../hooks"
import { StorageKey } from "../../../constants"

const useMetricExpressionRequestParameters = (view: HasView | undefined) => {
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
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [filtersExpression, setFiltersExpression] = usePersistentString(
    StorageKey.metricExpressionFiltersExpression,
    ""
  )
  const [selectedSegment, setSelectedSegment] = useState<Segment>()
  const [samplingLevel, setSamplingLevel] = useState(SamplingLevel.Default)
  const [pageToken, setPageToken] = usePersistentString(
    StorageKey.metricExpressionPageToken
  )
  const [pageSize, setPageSize] = usePersistentString(
    StorageKey.metricExpressionPageSize
  )

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
    metricExpressions,
    setMetricExpressions,
    metricAliases,
    setMetricAliases,
    selectedDimensions,
    setSelectedDimensions,
    filtersExpression,
    setFiltersExpression,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
    pageToken,
    setPageToken,
    pageSize,
    setPageSize,
  }
}

export default useMetricExpressionRequestParameters
