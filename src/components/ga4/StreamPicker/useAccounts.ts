import { useCallback, useMemo, useEffect } from "react"

import { Requestable, RequestStatus } from "@/types"
import { AccountSummaries } from "@/types/ga4/StreamPicker"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"
import useRequestStatus from "@/hooks/useRequestStatus"
import { useSelector } from "react-redux"

type AccountSummariesResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAccountSummariesResponse
const getAccountSummaries = (response: AccountSummariesResponse) =>
  response.accountSummaries
const getPageToken = (response: AccountSummariesResponse) =>
  response.nextPageToken

const useAccountSummaries = (): Requestable<AccountSummaries> => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])
  const { status, setInProgress, setFailed, setSuccessful } = useRequestStatus()

  const requestReady = useMemo(() => adminAPI !== undefined, [adminAPI])

  const paginatedRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined) {
        throw new Error(
          "invalid invariant. adminAPI cannot be undefined when this method is called."
        )
      }
      return adminAPI.accountSummaries.list({ pageToken })
    },
    [adminAPI]
  )

  const requestAccountSummaries = usePaginatedCallback(
    requestReady,
    "invalid invariant. adminAPI cannot be undefined when this method is called.",
    paginatedRequest,
    getAccountSummaries,
    getPageToken,
    setInProgress,
    setFailed
  )

  const { value: accountSummaries } = useCached(
    StorageKey.ga4AccountSummaries,
    requestAccountSummaries,
    moment.duration(5, "minutes"),
    requestReady
  )

  console.log("useAccountSummaries", { accountSummaries })

  useEffect(() => {
    if (accountSummaries !== undefined) {
      setSuccessful()
    }
  }, [accountSummaries, setSuccessful])

  switch (status) {
    case RequestStatus.Failed:
    case RequestStatus.InProgress:
    case RequestStatus.NotStarted:
      return { status }
    case RequestStatus.Successful: {
      if (accountSummaries === undefined) {
        throw new Error(
          "Invalid invariant - accountSummaries should not be undefined."
        )
      }
      return {
        status: RequestStatus.Successful,
        accounts: accountSummaries,
      }
    }
  }
}

export default useAccountSummaries
