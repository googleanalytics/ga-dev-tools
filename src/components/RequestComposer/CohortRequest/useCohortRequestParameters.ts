import { useState, useMemo, useCallback } from "react"

import {
  V4SamplingLevel,
  CohortSize,
  UASegment,
  UAColumn,
  useUASegments,
} from "@/components/UAPickers"
import { UAAccountPropertyView } from "@/components/ViewSelector/useAccountPropertyView"
import { useKeyedHydratedPersistantObject } from "@/hooks/useHydrated"
import { StorageKey } from "@/constants"
import { QueryParam } from "../RequestComposer"

const useCohortRequestParameters = (
  apv: UAAccountPropertyView,
  columns: UAColumn[] | undefined
) => {
  const [viewId, setViewId] = useState("")

  const getColumnByID = useCallback(
    (id: string | undefined) => {
      if (id === undefined || columns === undefined) {
        return undefined
      }
      return columns.find(c => c.id === id)
    },
    [columns]
  )

  const [
    selectedMetric,
    setSelectedMetricID,
  ] = useKeyedHydratedPersistantObject<UAColumn>(
    StorageKey.requestComposerCohortMetric,
    QueryParam.Metric,
    getColumnByID
  )

  const [samplingLevel, setSamplingLevel] = useState<V4SamplingLevel>()

  const segments = useUASegments()
  const getSegmentByID = useCallback(
    (id: string | undefined) => {
      if (id === undefined || segments === undefined) {
        return undefined
      }
      return segments.find(c => c.id === id)
    },
    [segments]
  )

  const [
    selectedSegment,
    setSelectedSegmentID,
  ] = useKeyedHydratedPersistantObject<UASegment>(
    StorageKey.requestComposerCohortSegment,
    QueryParam.Segment,
    getSegmentByID
  )
  const [cohortSize, setCohortSize] = useState<CohortSize | undefined>(
    CohortSize.Day
  )

  useMemo(() => {
    const id = apv.view?.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [apv])

  return {
    viewId,
    setViewId,
    selectedMetric,
    setSelectedMetricID,
    selectedSegment,
    setSelectedSegmentID,
    samplingLevel,
    setSamplingLevel,
    cohortSize,
    setCohortSize,
  }
}

export default useCohortRequestParameters
