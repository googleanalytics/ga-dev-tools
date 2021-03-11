import { useMemo } from "react"
import { Column, Segment } from "../_api"
import { SamplingLevel } from "../_HistogramRequest"

type ReportRequest = gapi.client.analyticsreporting.ReportRequest
type Request = { reportRequests: Array<ReportRequest> }

const usePivotRequest = ({
  viewId,
  startDate,
  endDate,
  metrics,
  pivotMetrics,
  dimensions,
  pivotDimensions,
  startGroup,
  selectedSegment,
  samplingLevel,
}: {
  viewId: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  metrics: Column[]
  pivotMetrics: Column[]
  dimensions: Column[]
  pivotDimensions: Column[]
  startGroup: string | undefined
  selectedSegment: Segment | undefined
  samplingLevel: SamplingLevel
}) => {
  const request = useMemo<Request | undefined>(() => {
    if (
      viewId === undefined ||
      startDate === undefined ||
      endDate === undefined ||
      metrics.length === 0 ||
      dimensions.length === 0 ||
      pivotMetrics.length === 0 ||
      pivotDimensions.length === 0
    ) {
      return
    }
    const reportRequest: ReportRequest = {
      viewId,
      metrics: metrics.map(metric => ({ expression: metric.id })),
      dimensions: dimensions.map(dimension => ({ name: dimension.id })),
      pivots: [
        {
          dimensions: pivotDimensions.map(dimension => ({
            name: dimension.id,
          })),
          metrics: pivotMetrics.map(pivot => ({ expression: pivot.id })),
        },
      ],
    }
    if (startGroup !== undefined) {
      const parsed = parseInt(startGroup, 10)
      if (isNaN(parsed)) {
        return
      }
      reportRequest["pivots"]![0].startGroup = parsed
    }
    if (selectedSegment !== undefined) {
      reportRequest["segments"] = [
        {
          segmentId: selectedSegment.segmentId,
        },
      ]
      reportRequest.dimensions = reportRequest!.dimensions!.concat([
        { name: "ga:segment" },
      ])
    }
    if (samplingLevel !== undefined) {
      reportRequest["samplingLevel"] = samplingLevel
    }

    return {
      reportRequests: [reportRequest],
    }
  }, [
    viewId,
    metrics,
    pivotMetrics,
    dimensions,
    pivotDimensions,
    startGroup,
    selectedSegment,
    samplingLevel,
  ])
  return request
}

export default usePivotRequest
