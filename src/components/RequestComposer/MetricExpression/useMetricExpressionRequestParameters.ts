import { useState, useMemo } from "react"

import { usePersistentString } from "@/hooks"
import { StorageKey } from "@/constants"
import { HasView } from "@/components/ViewSelector"
import {
  V4SamplingLevel,
  UADimensions,
  UASegment,
} from "@/components/UAPickers"

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
  const [selectedDimensions, setSelectedDimensions] = useState<UADimensions>()
  const [filtersExpression, setFiltersExpression] = usePersistentString(
    StorageKey.metricExpressionFiltersExpression,
    ""
  )
  const [selectedSegment, setSelectedSegment] = useState<UASegment>()
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
