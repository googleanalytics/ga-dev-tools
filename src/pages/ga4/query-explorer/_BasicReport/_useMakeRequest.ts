import { DateRange } from "../_DateRanges"
import { GA4Dimensions, GA4Metrics } from "../../../../components/GA4Pickers"
import { Requestable, RequestStatus } from "../../../../types"
import { useSelector } from "react-redux"
import { useMemo, useState, useCallback } from "react"
import { usePersistantObject } from "../../../../hooks"
import { StorageKey } from "../../../../constants"
import { FilterExpression } from "../_Filter/_index"

type RunReportRequest = gapi.client.analyticsdata.RunReportRequest
export type RunReportResponse = gapi.client.analyticsdata.RunReportResponse
type UseMakeRequestArgs = {
  property: string | undefined
  dimensionFilter: FilterExpression | undefined
  metricFilter: FilterExpression | undefined
  dateRanges: DateRange[]
  dimensions: GA4Dimensions
  metrics: GA4Metrics
  offset: string | undefined
  limit: string | undefined
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
}: UseMakeRequestArgs): Requestable<
  Common,
  Common,
  { response: RunReportResponse } & Common,
  { error: RunReportError } & Common
> => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = useMemo(() => gapi?.client.analyticsdata, [gapi])
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)
  const [response, setResponse] = usePersistantObject<object>(
    StorageKey.ga4RequestComposerBasicResponse
  )
  const [error, setError] = useState<any>()

  const request = useMemo<RunReportRequest | undefined>(() => {
    if (dimensions === undefined) {
      return undefined
    }
    const r: RunReportRequest = {
      dimensions: dimensions.map(dimension => ({
        name: dimension.apiName!,
      })),
      dateRanges: dateRanges.map(({ from, to }) => ({
        startDate: from,
        endDate: to,
      })),
    }
    if (metrics !== undefined) {
      r.metrics = metrics.map(metric => ({ name: metric.apiName }))
    }
    if (dimensionFilter !== undefined) {
      r.dimensionFilter = dimensionFilter
    }
    if (metricFilter !== undefined) {
      r.metricFilter = metricFilter
    }
    if (offset !== undefined && offset !== "") {
      r.offset = offset
    }
    if (limit !== undefined && limit !== "") {
      r.limit = limit
    }
    return r
  }, [
    dateRanges,
    dimensions,
    metrics,
    dimensionFilter,
    metricFilter,
    offset,
    limit,
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
    setRequestStatus(RequestStatus.Pending)
    const propertyString = property.startsWith("properties/")
      ? property
      : `properties/${property}`
    dataAPI.properties
      .runReport({ property: propertyString, resource: request })
      .then(response => {
        const result = response.result
        setResponse(result)
        setRequestStatus(RequestStatus.Complete)
      })
      .catch(e => {
        console.log(e.result.error)
        setError(e.result.error)
        setRequestStatus(RequestStatus.Failed)
      })
  }, [property, dataAPI, request, setResponse])

  if (requestStatus === RequestStatus.Complete) {
    if (response === undefined) {
      throw new Error(
        "Invalid invariant. Response should always be defined here."
      )
    }
    return {
      requestStatus,
      makeRequest,
      validRequest,
      request,
      response,
    }
  }

  if (requestStatus === RequestStatus.Failed) {
    return {
      requestStatus,
      makeRequest,
      validRequest,
      request,
      error,
      response: undefined,
    }
  }
  return {
    requestStatus,
    makeRequest,
    validRequest,
    request,
    response: undefined,
  }
}

export default useMakeRequest
