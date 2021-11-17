import { useMemo, useState, useCallback } from "react"
import { useSelector } from "react-redux"

import { Requestable, RequestStatus } from "@/types"
import { usePersistantObject } from "@/hooks"
import { StorageKey } from "@/constants"
import { GA4Dimensions, GA4Metrics } from "@/components/GA4Pickers"
import { FilterExpression } from "../Filter"
import { DateRange } from "../DateRanges"
import { MetricAggregation } from "../MetricAggregations"
import { PropertySummary } from "@/types/ga4/StreamPicker"

type RunReportRequest = gapi.client.analyticsdata.RunReportRequest
type OrderBy = gapi.client.analyticsdata.OrderBy
type CohortSpec = gapi.client.analyticsdata.CohortSpec
export type RunReportResponse = gapi.client.analyticsdata.RunReportResponse

type UseMakeRequestArgs = {
  property: PropertySummary | undefined
  dimensionFilter: FilterExpression | undefined
  metricFilter: FilterExpression | undefined
  dateRanges: DateRange[] | undefined
  dimensions: GA4Dimensions
  metrics: GA4Metrics
  offset: string | undefined
  limit: string | undefined
  orderBys: OrderBy[] | undefined
  cohortSpec: CohortSpec | undefined
  metricAggregations: MetricAggregation[] | undefined
  keepEmptyRows: boolean
  showAdvanced: boolean
}

type Common = {
  makeRequest: () => void
  validRequest: boolean
  request: RunReportRequest | undefined
  response: RunReportResponse | undefined
}
export type RunReportError = {
  code: number
  message: string
  status: string
}
const useMakeRequest = ({
  property,
  dateRanges,
  dimensions,
  metrics,
  dimensionFilter,
  metricFilter,
  offset,
  limit,
  orderBys,
  cohortSpec,
  metricAggregations,
  keepEmptyRows,
  showAdvanced,
}: UseMakeRequestArgs): Requestable<
  { response: RunReportResponse } & Common,
  Common,
  Common,
  { error: RunReportError } & Common
> => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = useMemo(() => gapi?.client?.analyticsdata, [gapi])
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)
  const [response, setResponse] = usePersistantObject<object>(
    StorageKey.ga4RequestComposerBasicResponse
  )
  const [error, setError] = useState<any>()

  const request = useMemo<RunReportRequest | undefined>(() => {
    if (
      (dimensions === undefined || dimensions.length === 0) &&
      (metrics === undefined || metrics.length === 0)
    ) {
      return undefined
    }
    const r: RunReportRequest = {}
    if (dimensions !== undefined) {
      r.dimensions = dimensions.map(dimension => ({
        name: dimension.apiName!,
      }))
    }
    if (metrics !== undefined) {
      r.metrics = metrics.map(metric => ({ name: metric.apiName }))
    }
    if (dateRanges !== undefined) {
      r.dateRanges = dateRanges.map(({ from, to, name }) => {
        const newRange = { startDate: from, endDate: to, name }
        if (name === "" || name === undefined) {
          delete newRange.name
        }
        return newRange
      })
    }
    if (dimensionFilter !== undefined) {
      if (showAdvanced || (!showAdvanced && dimensionFilter.filter?.fieldName))
        r.dimensionFilter = dimensionFilter
    }
    if (metricFilter !== undefined) {
      if (showAdvanced || (!showAdvanced && metricFilter.filter?.fieldName))
        r.metricFilter = metricFilter
    }
    if (offset !== undefined && offset !== "") {
      r.offset = offset
    }
    if (limit !== undefined && limit !== "") {
      r.limit = limit
    }
    if (orderBys !== undefined && orderBys.length !== 0) {
      r.orderBys = orderBys
    }
    if (
      showAdvanced &&
      cohortSpec !== undefined &&
      (cohortSpec.cohorts?.length || 0) > 0
    ) {
      r.cohortSpec = cohortSpec
    }
    if (keepEmptyRows === true) {
      r.keepEmptyRows = keepEmptyRows
    }
    if (metricAggregations !== undefined && metricAggregations.length !== 0) {
      r.metricAggregations = metricAggregations
    }
    return r
  }, [
    dateRanges,
    dimensions,
    metricAggregations,
    metrics,
    dimensionFilter,
    metricFilter,
    offset,
    limit,
    orderBys,
    cohortSpec,
    keepEmptyRows,
    showAdvanced,
  ])

  const validRequest = useMemo(() => {
    return request !== undefined
  }, [request])

  const makeRequest = useCallback(() => {
    if (
      dataAPI === undefined ||
      request === undefined ||
      property === undefined
    ) {
      return
    }
    setRequestStatus(RequestStatus.InProgress)
    dataAPI.properties
      .runReport({ property: property.property!, resource: request })
      .then(response => {
        const result = response.result
        setResponse(result)
        setRequestStatus(RequestStatus.Successful)
      })
      .catch(e => {
        console.error({ e })
        setError(e.result.error)
        setRequestStatus(RequestStatus.Failed)
      })
  }, [property, dataAPI, request, setResponse])

  if (requestStatus === RequestStatus.Successful) {
    if (response === undefined) {
      throw new Error(
        "Invalid invariant. Response should always be defined here."
      )
    }
    return {
      status: requestStatus,
      makeRequest,
      validRequest,
      request,
      response,
    }
  }

  if (requestStatus === RequestStatus.Failed) {
    return {
      status: requestStatus,
      makeRequest,
      validRequest,
      request,
      error,
      response: undefined,
    }
  }
  return {
    status: requestStatus,
    makeRequest,
    validRequest,
    request,
    response: undefined,
  }
}

export default useMakeRequest
