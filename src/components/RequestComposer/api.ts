import { useSelector } from "react-redux"
import { useEffect, useState, useCallback, useMemo } from "react"

export type GetReportsResponse = gapi.client.analyticsreporting.GetReportsResponse

type ReportingAPI = typeof gapi.client.analyticsreporting

export const useAnalyticsReportingAPI = (): ReportingAPI | undefined => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const [reportingAPI, setReportingAPI] = useState<ReportingAPI>()

  useEffect(() => {
    if (gapi === undefined) {
      return
    }
    setReportingAPI(gapi?.client?.analyticsreporting)
  }, [gapi])

  return reportingAPI
}

type GetReportsRequest = gapi.client.analyticsreporting.GetReportsRequest

export const useMakeReportsRequest = (
  requestObject: GetReportsRequest | undefined
) => {
  const reportingAPI = useAnalyticsReportingAPI()
  const [response, setResponse] = useState<GetReportsResponse>()
  const [longRequest, setLongRequest] = useState(false)

  const canMakeRequest = useMemo(() => {
    return requestObject !== undefined
  }, [requestObject])

  const makeRequest = useCallback(() => {
    if (reportingAPI === undefined || requestObject === undefined) {
      return
    }
    ;(async () => {
      const first = await Promise.race<string>([
        (async () => {
          const response = await reportingAPI.reports.batchGet(
            {},
            requestObject
          )
          setResponse(response.result)
          setTimeout(() => {
            setLongRequest(false)
          }, 500)
          return "API"
        })(),
        new Promise<string>(resolve => {
          window.setTimeout(() => {
            resolve("TIMEOUT")
          }, 300)
        }),
      ])
      if (first === "TIMEOUT") {
        setLongRequest(true)
      }
    })()
  }, [reportingAPI, requestObject])

  return { makeRequest, response, longRequest, canMakeRequest }
}
