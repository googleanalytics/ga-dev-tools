import { DateRange } from "../_DateRanges"
import { GA4Dimensions } from "../../../../components/GA4Pickers"
import { Requestable, RequestStatus } from "../../../../types"
import { useSelector } from "react-redux"
import { useMemo, useState, useCallback } from "react"
import { usePersistantObject } from "../../../../hooks"
import { StorageKey } from "../../../../constants"

type RunReportRequest = gapi.client.analyticsdata.RunReportRequest
export type RunReportResponse = gapi.client.analyticsdata.RunReportResponse
type UseMakeRequestArgs = {
  property: string | undefined
  dateRanges: DateRange[]
  dimensions: GA4Dimensions
}

const useMakeRequest = ({
  property,
  dateRanges,
  dimensions,
}: UseMakeRequestArgs): Requestable<
  { response: RunReportResponse },
  { response: undefined },
  {
    makeRequest: () => void
    validRequest: boolean
    request: RunReportRequest | undefined
  }
> => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = useMemo(() => gapi?.client.analyticsdata, [gapi])
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)
  const [response, setResponse] = usePersistantObject<object>(
    StorageKey.ga4RequestComposerBasicResponse
  )

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
    return r
  }, [dateRanges, dimensions])

  const validRequest = useMemo(() => {
    return true
  }, [])

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
      response,
      validRequest,
      request,
    }
  }
  return {
    requestStatus,
    makeRequest,
    response: undefined,
    validRequest,
    request,
  }
}

export default useMakeRequest
