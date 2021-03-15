import { Column, Segment, SamplingLevel } from "../_api"
import { useMemo } from "react"

type ReportRequest = gapi.client.analyticsreporting.ReportRequest
type Request = { reportRequests: Array<ReportRequest> }

interface Parameters {
  viewId: string
  samplingLevel: SamplingLevel | undefined
  filtersExpression: string | undefined
  startDate: string
  endDate: string
  metricExpressions: string
  selectedDimensions: Column[]
  selectedSegment: Segment | undefined
  pageToken: string | undefined
  pageSize: string | undefined
}

const useMetricExpressionRequest = ({
  viewId,
  samplingLevel,
  filtersExpression,
  startDate,
  endDate,
  metricExpressions,
  selectedDimensions,
  selectedSegment,
  pageToken,
  pageSize,
}: Parameters): Request | undefined => {
  const metricExpressionRequestObject = useMemo<Request | undefined>(() => {
    // TODO - there could be helpful error messaging here.
    if (viewId === undefined) {
      return undefined
    }

    const baseMetricExpressions = metricExpressions.split(",")
    // TODO - there could be helpful error messaging here.
    if (baseMetricExpressions.length === 0) {
      return
    }
    const metrics = baseMetricExpressions.map(expression => ({ expression }))

    const reportRequest: ReportRequest = {
      viewId,
      metrics,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
    }

    if (selectedDimensions.length > 0) {
      reportRequest["dimensions"] = selectedDimensions.map(column => ({
        name: column.id,
      }))
    }

    if (filtersExpression !== undefined && filtersExpression !== "") {
      reportRequest["filtersExpression"] = filtersExpression
    }

    if (selectedSegment !== undefined) {
      reportRequest["segments"] = [{ segmentId: selectedSegment.segmentId }]
      reportRequest["dimensions"] = (reportRequest["dimensions"] || []).concat([
        {
          name: "ga:segment",
        },
      ])
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

    if (samplingLevel !== undefined) {
      reportRequest["samplingLevel"] = samplingLevel
    }

    return {
      reportRequests: [reportRequest],
    }
  }, [
    viewId,
    samplingLevel,
    filtersExpression,
    startDate,
    endDate,
    metricExpressions,
    selectedDimensions,
    selectedSegment,
    pageToken,
    pageSize,
  ])

  return metricExpressionRequestObject
}

export default useMetricExpressionRequest
