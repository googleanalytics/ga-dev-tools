import { useMemo } from "react"
import { Column, Segment, SamplingLevel } from "../_api"

type ReportRequest = gapi.client.analyticsreporting.ReportRequest
type Request = { reportRequests: Array<ReportRequest> }

interface Parameters {
  viewId: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  metrics: Column[]
  pivotMetrics: Column[]
  dimensions: Column[]
  pivotDimensions: Column[]
  startGroup: string | undefined
  maxGroupCount: string | undefined
  selectedSegment: Segment | undefined
  samplingLevel: SamplingLevel
  pageToken: string | undefined
  pageSize: string | undefined
  includeEmptyRows: boolean
}

const usePivotRequest = ({
  viewId,
  startDate,
  endDate,
  metrics,
  pivotMetrics,
  dimensions,
  pivotDimensions,
  startGroup,
  maxGroupCount,
  selectedSegment,
  samplingLevel,
  pageToken,
  pageSize,
  includeEmptyRows,
}: Parameters) => {
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
      includeEmptyRows,
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
      if (!isNaN(parsed)) {
        reportRequest["pivots"]![0].startGroup = parsed
      }
    }
    if (maxGroupCount !== undefined) {
      const parsed = parseInt(maxGroupCount, 10)
      if (!isNaN(parsed)) {
        reportRequest["pivots"]![0].maxGroupCount = parsed
      }
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
    if (pageToken !== undefined) {
      reportRequest["pageToken"] = pageToken
    }
    if (pageSize !== undefined) {
      const parsed = parseInt(pageSize, 10)
      if (!isNaN(parsed)) {
        reportRequest["pageSize"] = parsed
      }
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
    maxGroupCount,
    selectedSegment,
    samplingLevel,
    pageToken,
    pageSize,
    includeEmptyRows,
  ])
  return request
}

export default usePivotRequest
