import { useState, useMemo } from "react"
import { HasView } from "../../../components/ViewSelector"
import { Column, Segment } from "../_api"
import { SamplingLevel } from "../_HistogramRequest"
import { CohortSize } from "./_useCohortRequest"

const useCohortRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedMetric, setSelectedMetric] = useState<Column>()
  const [samplingLevel, setSamplingLevel] = useState<SamplingLevel>()
  const [selectedSegment, setSelectedSegment] = useState<Segment>()
  const [cohortSize, setCohortSize] = useState<CohortSize>(CohortSize.Day)

  useMemo(() => {
    const id = view?.view.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [view])

  return {
    viewId,
    setViewId,
    selectedMetric,
    setSelectedMetric,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
    cohortSize,
    setCohortSize,
  }
}

export default useCohortRequestParameters
