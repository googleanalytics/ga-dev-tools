import * as React from "react"

import { useSelector } from "react-redux"

import { Requestable, RequestStatus } from "@/types"
import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
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

export type DimensionsAndMetricsRequest = Requestable<Successful>

export const DimensionsAndMetricsRequestCtx = React.createContext<DimensionsAndMetricsRequest>(
  { status: RequestStatus.NotStarted }
)

export const useDimensionsAndMetrics = (
  aps: AccountProperty
): Requestable<Successful> => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = React.useMemo(() => gapi?.client?.analyticsdata, [gapi])

  const propertyName = React.useMemo(
    () => `${aps.property?.property || "properties/0"}/metadata`,
    [aps.property]
  )

  const requestReady = React.useMemo(() => dataAPI !== undefined, [dataAPI])

  const getMetadata = React.useCallback(async () => {
    if (dataAPI === undefined) {
      throw new Error("Invalid invariant - dataAPI must be defined.")
    }
    const { result } = await dataAPI.properties.getMetadata({
      name: propertyName,
    })
    return { metrics: result.metrics, dimensions: result.dimensions }
  }, [dataAPI, propertyName])

  const metadataRequest = useCached(
    `${StorageKey.ga4DimensionsMetrics}/${propertyName}` as StorageKey,
    getMetadata,
    moment.duration(5, "minutes"),
    requestReady
  )

  return React.useMemo(() => {
    switch (metadataRequest.status) {
      case RequestStatus.InProgress:
      case RequestStatus.NotStarted:
      case RequestStatus.Failed:
        return { status: metadataRequest.status }
      case RequestStatus.Successful: {
        const { metrics = [], dimensions = [] } = metadataRequest.value
        const categories = [
          ...new Set<string>(
            metrics
              .concat(dimensions)
              // TODO - remove the any casts once the types are updated to
              // include category.
              .map(m => (m as any).category)
          ),
        ].map(category => ({
          category,
          dimensions: dimensions.filter(d => (d as any).category === category),
          metrics: metrics.filter(m => (m as any).category === category),
        }))
        return {
          status: metadataRequest.status,
          categories,
          dimensions,
          metrics,
        }
      }
    }
  }, [metadataRequest])
}
