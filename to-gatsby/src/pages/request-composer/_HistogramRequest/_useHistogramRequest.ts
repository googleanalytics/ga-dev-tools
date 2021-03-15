import { Column, Segment, SamplingLevel } from "../_api"
import { useMemo } from "react"

type ReportRequest = gapi.client.analyticsreporting.ReportRequest
type Request = { reportRequests: Array<ReportRequest> }

interface Parameters {
  selectedMetrics: Column[]
  selectedDimensions: Column[]
  buckets: string | undefined
  viewId: string
  startDate: string | undefined
  endDate: string | undefined
  filtersExpression: string | undefined
  selectedSegment: Segment | undefined
  samplingLevel: SamplingLevel | undefined
}

const useHistogramRequest = ({
  selectedMetrics,
  selectedDimensions,
  buckets,
  viewId,
  startDate,
  endDate,
  filtersExpression,
  selectedSegment,
  samplingLevel,
}: Parameters): Request | undefined => {
  const histogramRequestObject = useMemo<Request | undefined>(() => {
    if (
      viewId === undefined ||
      buckets === undefined ||
      startDate === undefined ||
      endDate === undefined
    ) {
      return undefined
    }
    const reportRequest: ReportRequest = {
      viewId,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
    }

    if (selectedMetrics.length > 0) {
      reportRequest["metrics"] = selectedMetrics.map(column => ({
        expression: column.id,
      }))
    }
    if (selectedDimensions.length > 0) {
      reportRequest["dimensions"] = selectedDimensions.map(column => ({
        // TODO - The types for this are incorrect. Might need to check the
        // client library code?
        histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)) as any,
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
          histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)) as any,
          name: "ga:segment",
        },
      ])
    }
    if (samplingLevel !== undefined) {
      reportRequest["samplingLevel"] = samplingLevel
    }

    return {
      reportRequests: [reportRequest],
    }
  }, [
    selectedMetrics,
    buckets,
    selectedDimensions,
    viewId,
    startDate,
    endDate,
    filtersExpression,
    selectedSegment,
  ])

  return histogramRequestObject
}

export default useHistogramRequest
