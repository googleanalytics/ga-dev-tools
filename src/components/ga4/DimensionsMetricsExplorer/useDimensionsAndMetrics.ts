import * as React from "react"

import { useSelector } from "react-redux"

import { Requestable, RequestStatus } from "@/types"
import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import useRequestStatus from "@/hooks/useRequestStatus"
import moment from "moment"
import { AccountProperty } from "../StreamPicker/useAccountProperty"

export type Dimension = gapi.client.analyticsdata.DimensionMetadata
export type Metric = gapi.client.analyticsdata.MetricMetadata
export type Successful = {
  dimensions: Dimension[]
  metrics: Metric[]
  categories: Array<{
    category: string
    dimensions: Dimension[]
    metrics: Metric[]
  }>
}

export const useDimensionsAndMetrics = (
  aps: AccountProperty
): Requestable<Successful> => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = React.useMemo(() => gapi?.client.analyticsdata, [gapi])
  const {
    status,
    setInProgress,
    setFailed,
    setSuccessful,
    setNotStarted,
  } = useRequestStatus()

  const propertyName = React.useMemo(
    () => `${aps.property?.property || "properties/0"}/metadata`,
    [aps.property]
  )

  React.useEffect(() => {
    setNotStarted()
  }, [propertyName, setNotStarted])

  const requestReady = React.useMemo(() => dataAPI !== undefined, [dataAPI])

  const getMetadata = React.useCallback(async () => {
    try {
      if (dataAPI === undefined) {
        throw new Error("Invalid invariant - dataAPI must be defined.")
      }
      setInProgress()
      const { result } = await dataAPI.properties.getMetadata({
        name: propertyName,
      })
      return { metrics: result.metrics, dimensions: result.dimensions }
    } catch (e) {
      setFailed()
    }
  }, [dataAPI, propertyName, setFailed, setInProgress])

  const dimsAndMets = useCached(
    `${StorageKey.ga4DimensionsMetrics}/${propertyName}` as StorageKey,
    getMetadata,
    moment.duration(5, "minutes"),
    requestReady
  )

  React.useEffect(() => {
    if (dimsAndMets !== undefined) {
      setSuccessful()
    }
  }, [dimsAndMets, setSuccessful])

  const categories = React.useMemo(
    () =>
      [
        ...new Set<string>(
          (dimsAndMets?.metrics || [])
            // TODO - remove the any casts once the types are updated to
            // include category.
            .map(m => (m as any).category)
            .concat(dimsAndMets?.dimensions?.map(d => (d as any).category))
        ),
      ].map(category => ({
        category,
        dimensions: (dimsAndMets?.dimensions || []).filter(
          d => (d as any).category === category
        ),
        metrics: (dimsAndMets?.metrics || []).filter(
          m => (m as any).category === category
        ),
      })),
    [dimsAndMets]
  )

  const dimensions = React.useMemo(() => dimsAndMets?.dimensions, [dimsAndMets])
  const metrics = React.useMemo(() => dimsAndMets?.metrics, [dimsAndMets])

  if (status === RequestStatus.Successful) {
    if (dimensions === undefined || metrics === undefined) {
      throw new Error(
        "Invalid invariant - dimensions & metrics must be defined."
      )
    }
    return { status, dimensions, metrics, categories }
  }
  return { status }
}
