import { useState, useMemo } from "react"
import { HasView } from "../../../components/ViewSelector"
import { Column, Segment, SamplingLevel } from "../_api"
import { usePersistentString, usePersistentBoolean } from "../../../hooks"
import { StorageKey } from "../../../constants"

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
  const [selectedMetrics, setSelectedMetrics] = useState<Column[]>([])
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [pivotMetrics, setPivotMetrics] = useState<Column[]>([])
  const [pivotDimensions, setPivotDimensions] = useState<Column[]>([])
  const [startGroup, setStartGroup] = usePersistentString(
    StorageKey.pivotRequestStartGroup
  )
  const [maxGroupCount, setMaxGroupCount] = usePersistentString(
    StorageKey.pivotRequestMaxGroupCount
  )
  const [selectedSegment, setSelectedSegment] = useState<Segment>()
  const [samplingLevel, setSamplingLevel] = useState(SamplingLevel.Default)
  const [segment, setSegment] = useState<Segment>()
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
    segment,
    setSegment,
    includeEmptyRows,
    setIncludeEmptyRows,
    pageToken,
    setPageToken,
    pageSize,
    setPageSize,
  }
}

export default usePivotRequestParameters
