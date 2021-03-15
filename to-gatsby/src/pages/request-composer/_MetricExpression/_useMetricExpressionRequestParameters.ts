import { useState, useMemo } from "react"
import { HasView } from "../../../components/ViewSelector"
import { Column, Segment, SamplingLevel } from "../_api"

const useMetricExpressionRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [startDate, setStartDate] = useState("7daysAgo")
  const [endDate, setEndDate] = useState("yesterday")
  const [metricExpressions, setMetricExpressions] = useState("")
  const [metricAliases, setMetricAliases] = useState("")
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [filtersExpression, setFiltersExpression] = useState("")
  // const [pivotMetrics, setPivotMetrics] = useState<Column[]>([])
  // const [pivotDimensions, setPivotDimensions] = useState<Column[]>([])
  // const [startGroup, setStartGroup] = useState("")
  // const [maxGroupCount, setMaxGroupCount] = useState("")
  const [selectedSegment, setSelectedSegment] = useState<Segment>()
  const [samplingLevel, setSamplingLevel] = useState(SamplingLevel.Default)
  // const [segment, setSegment] = useState<Segment>()
  const [pageToken, setPageToken] = useState<string>()
  const [pageSize, setPageSize] = useState<string>()
  // const [includeEmptyRows, setIncludeEmptyRows] = useState(false)

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
