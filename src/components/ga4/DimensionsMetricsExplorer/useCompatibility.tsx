import { useAddToArray } from "@/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { AccountProperty } from "../StreamPicker/useAccountProperty"
import { Dimension, Metric } from "./useDimensionsAndMetrics"

export interface CompatibleHook {
  dimensions: Dimension[] | undefined
  incompatibleDimensions: Dimension[] | undefined
  metrics: Metric[] | undefined
  incompatibleMetrics: Metric[] | undefined
  addDimension: (d: Dimension) => void
  removeDimension: (d: Dimension) => void
  addMetric: (m: Metric) => void
  removeMetric: (m: Metric) => void
  reset: () => void
  hasFieldSelected: boolean
}

const useCompatibility = (ap: AccountProperty): CompatibleHook => {
  const gapi = useSelector((a: AppState) => a.gapi)

  const [dimensions, setDimensions] = useState<Dimension[]>()
  const [incompatibleDimensions, setIncompatibleDimensions] = useState<
    Dimension[]
  >()
  const [metrics, setMetrics] = useState<Metric[]>()
  const [incompatibleMetrics, setIncompatibleMetrics] = useState<Metric[]>()

  const addDimension = useAddToArray(setDimensions)
  const removeDimension = useCallback((dimension: Dimension) => {
    setDimensions(old => old?.filter(d => d.apiName !== dimension.apiName))
  }, [])

  const addMetric = useAddToArray(setMetrics)
  const removeMetric = useCallback((metric: Metric) => {
    setMetrics(old => old?.filter(d => d.apiName !== metric.apiName))
  }, [])

  const reset = useCallback(() => {
    setDimensions(undefined)
    setMetrics(undefined)
    setIncompatibleDimensions(undefined)
    setIncompatibleMetrics(undefined)
  }, [])

  useEffect(() => {
    if (gapi === undefined || ap.property === undefined) {
      return
    }
    if (
      (dimensions === undefined || dimensions.length === 0) &&
      (metrics === undefined || metrics.length === 0)
    ) {
      setIncompatibleMetrics(undefined)
      setIncompatibleDimensions(undefined)
      return
    }
    gapi.client
      .request({
        path: `https://content-analyticsdata.googleapis.com/v1beta/${ap.property?.property}:checkCompatibility`,
        method: "POST",
        body: JSON.stringify({
          property: ap.property.property,
          dimensions: dimensions?.map(d => ({ name: d.apiName })),
          metrics: metrics?.map(m => ({ name: m.apiName })),
        }),
      })
      .then(response => {
        const {
          dimensionCompatibilities,
          metricCompatibilities,
        } = response.result
        const d = dimensionCompatibilities
          .filter(d => d.compatibility === "INCOMPATIBLE")
          .map(d => d.dimensionMetadata)
        const m = metricCompatibilities
          .filter(m => m.compatibility === "INCOMPATIBLE")
          .map(m => m.metricMetadata)
        setIncompatibleMetrics(m)
        setIncompatibleDimensions(d)
      })
      .catch(console.error)
  }, [gapi, dimensions, metrics, ap.property])

  const hasFieldSelected = useMemo(
    () =>
      (dimensions !== undefined && dimensions.length) > 0 ||
      (metrics !== undefined && metrics.length > 0),
    [dimensions, metrics]
  )

  return {
    dimensions,
    metrics,
    addDimension,
    removeDimension,
    addMetric,
    removeMetric,
    reset,
    incompatibleMetrics,
    incompatibleDimensions,
    hasFieldSelected,
  }
}

export default useCompatibility
