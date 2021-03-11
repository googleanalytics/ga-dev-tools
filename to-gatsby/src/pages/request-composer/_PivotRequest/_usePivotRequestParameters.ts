import { useState, useMemo } from "react"
import { HasView } from "../../../components/ViewSelector"
import { Column, Segment } from "../_api"
import { SamplingLevel } from "../_HistogramRequest"

const usePivotRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [startDate, setStartDate] = useState("7daysAgo")
  const [endDate, setEndDate] = useState("yesterday")
  const [selectedMetrics, setSelectedMetrics] = useState<Column[]>([])
  const [selectedDimensions, setSelectedDimensions] = useState<Column[]>([])
  const [pivotMetrics, setPivotMetrics] = useState<Column[]>([])
  const [pivotDimensions, setPivotDimensions] = useState<Column[]>([])
  const [startGroup, setStartGroup] = useState("")
  const [maxGroupCount, setMaxGroupCount] = useState("")
  const [selectedSegment, setSelectedSegment] = useState<Segment>()
  const [samplingLevel, setSamplingLevel] = useState<SamplingLevel>()
  const [segment, setSegment] = useState<Segment>()

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
  }
}

export default usePivotRequestParameters
