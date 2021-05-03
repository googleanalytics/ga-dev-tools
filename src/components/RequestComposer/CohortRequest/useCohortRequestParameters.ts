import { useState, useMemo } from "react"

import { HasView } from "@/components/ViewSelector"
import {
  V4SamplingLevel,
  CohortSize,
  UAMetric,
  UASegment,
} from "@/components/UAPickers"

const useCohortRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedMetric, setSelectedMetric] = useState<UAMetric>()
  const [samplingLevel, setSamplingLevel] = useState<V4SamplingLevel>()
  const [selectedSegment, setSelectedSegment] = useState<UASegment>()
  const [cohortSize, setCohortSize] = useState<CohortSize | undefined>(
    CohortSize.Day
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
