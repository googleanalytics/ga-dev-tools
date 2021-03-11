import { useCallback, useState } from "react"
import { useAnalyticsReportingAPI } from "../_api"
import { GetReportsResponse } from "../../../api"

type GetReportsRequest = gapi.client.analyticsreporting.GetReportsRequest

// TODO - These might actually all end up being the same in which case there
// should probably not be code duplication.
const useMakePivotRequest = (requestObject: GetReportsRequest | undefined) => {
  const reportingAPI = useAnalyticsReportingAPI()
  const [response, setResponse] = useState<GetReportsResponse>()
  const [longRequest, setLongRequest] = useState(false)

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

  return { makeRequest, response, longRequest }
}

export default useMakePivotRequest
