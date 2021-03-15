import { Column, Segment, SamplingLevel } from "../_api"
import { useMemo } from "react"

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
}: {
  selectedMetrics: Column[]
  selectedDimensions: Column[]
  buckets: string
  viewId: string
  startDate: string
  endDate: string
  filtersExpression: string
  selectedSegment: Segment | undefined
  samplingLevel: SamplingLevel | undefined
}) => {
  const histogramRequestObject = useMemo(() => {
    if (viewId === undefined) {
      return undefined
    }
    const optionalParameters = {}
    if (selectedMetrics.length > 0) {
      optionalParameters["metrics"] = selectedMetrics.map(column => ({
        expression: column.id,
      }))
    }
    if (selectedDimensions.length > 0) {
      optionalParameters["dimensions"] = selectedDimensions.map(column => ({
        histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)),
        name: column.id,
      }))
    }
    if (filtersExpression !== "") {
      optionalParameters["filtersExpression"] = filtersExpression
    }
    if (selectedSegment !== undefined) {
      optionalParameters["segments"] = [
        { segmentId: selectedSegment.segmentId },
      ]
      optionalParameters["dimensions"] = [
        {
          histogramBuckets: buckets.split(",").map(s => parseInt(s, 10)),
          name: "ga:segment",
        },
      ].concat(optionalParameters["dimensions"] || [])
    }
    if (samplingLevel !== undefined) {
      optionalParameters["samplingLevel"] = samplingLevel
    }

    return {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          ...optionalParameters,
        },
      ],
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
