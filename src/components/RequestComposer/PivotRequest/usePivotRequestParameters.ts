import { useState, useMemo } from "react"

import { usePersistentString, usePersistentBoolean } from "@/hooks"
import { StorageKey } from "@/constants"
import { HasView } from "@/components/ViewSelector"
import {
  V4SamplingLevel,
  UAMetrics,
  UADimensions,
  UASegment,
} from "@/components/UAPickers"

const usePivotRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [startDate, setStartDate] = usePersistentString(
    StorageKey.pivotRequestStartDate,
    "7daysAgo"
  )
  const [endDate, setEndDate] = usePersistentString(
    StorageKey.pivotRequestEndDate,
    "yesterday"
  )
  const [selectedMetrics, setSelectedMetrics] = useState<UAMetrics>()
  const [selectedDimensions, setSelectedDimensions] = useState<UADimensions>()
  const [pivotMetrics, setPivotMetrics] = useState<UAMetrics>()
  const [pivotDimensions, setPivotDimensions] = useState<UADimensions>()
  const [startGroup, setStartGroup] = usePersistentString(
    StorageKey.pivotRequestStartGroup
  )
  const [maxGroupCount, setMaxGroupCount] = usePersistentString(
    StorageKey.pivotRequestMaxGroupCount
  )
  const [selectedSegment, setSelectedSegment] = useState<UASegment>()
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
    selectedMetrics,
    setSelectedMetrics,
    selectedDimensions,
    setSelectedDimensions,
    pivotMetrics,
    setPivotMetrics,
    pivotDimensions,
    setPivotDimensions,
    startGroup,
    setStartGroup,
    maxGroupCount,
    setMaxGroupCount,
    selectedSegment,
    setSelectedSegment,
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
