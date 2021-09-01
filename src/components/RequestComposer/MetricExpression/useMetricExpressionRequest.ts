import { useMemo } from "react"

import { V4SamplingLevel } from "@/components/UAPickers"
import { ReportsRequest, ReportRequest } from "../RequestComposer"
import { Column, Segment } from "@/types/ua"

interface Parameters {
  viewId: string
  samplingLevel: V4SamplingLevel | undefined
  filtersExpression: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  metricExpressions: string | undefined
  metricAliases: string | undefined
  selectedDimensions: Column[] | undefined
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
  metricAliases,
  selectedDimensions,
  selectedSegment,
  pageToken,
  pageSize,
}: Parameters): ReportsRequest | undefined => {
  const metricExpressionRequestObject = useMemo<
    ReportsRequest | undefined
  >(() => {
    if (
      viewId === undefined ||
      viewId === "" ||
      metricExpressions === undefined ||
      metricExpressions === "" ||
      startDate === undefined ||
      startDate === "" ||
      endDate === undefined ||
      endDate === ""
    ) {
      return undefined
    }

    const baseMetricExpressions = metricExpressions.split(",")
    // TODO - there could be helpful error messaging here.
    if (baseMetricExpressions.length === 0) {
      return
    }
    const aliases = (metricAliases || "").split(",")
    const metrics = baseMetricExpressions.map((expression, idx) => {
      const alias = aliases[idx]
      const metric = {
        expression,
      }
      if (alias !== undefined) {
        metric["alias"] = alias
      }
      return metric
    })

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

    if (selectedDimensions !== undefined && selectedDimensions.length > 0) {
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
    metricAliases,
  ])

  return metricExpressionRequestObject
}

export default useMetricExpressionRequest
