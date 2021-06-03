import { useState, useEffect } from "react"

import useGapi from "@/hooks/useGapi"
import { Requestable, RequestStatus } from "@/types"
import {
  AccountSummary,
  AccountSummariesRequest,
} from "@/types/ga4/StreamPicker"

const useAccountSummaries = (): Requestable<AccountSummariesRequest> => {
  const gapi = useGapi()
  const [status, setStatus] = useState(RequestStatus.NotStarted)
  const [pageToken, setPageToken] = useState<string>()
  const [accountSummaries, setAccountSummaries] = useState<AccountSummary[]>()

  useEffect(() => {
    if (status === RequestStatus.NotStarted) {
      setStatus(RequestStatus.InProgress)
    }
    if (status === RequestStatus.InProgress && gapi !== undefined) {
      gapi.client.analyticsadmin.accountSummaries
        .list({ pageToken })
        .then(response => {
          const nextToken = response.result.nextPageToken
          setAccountSummaries((old = []) =>
            old.concat(response.result.accountSummaries || [])
          )
          if (nextToken === undefined) {
            setStatus(RequestStatus.Successful)
          } else {
            setPageToken(nextToken)
          }
        })
        .catch(e => {
          console.error({ e })
          setAccountSummaries(undefined)
          setStatus(RequestStatus.Failed)
        })
    }
  }, [gapi, pageToken, status])

  switch (status) {
    case RequestStatus.Failed:
      return { status: RequestStatus.Failed }
    case RequestStatus.InProgress:
      return { status: RequestStatus.InProgress }
    case RequestStatus.NotStarted:
      return { status: RequestStatus.NotStarted }
    case RequestStatus.Successful: {
      return {
        status: RequestStatus.Successful,
        accountSummaries: accountSummaries || [],
      }
    }
  }
}

export default useAccountSummaries
