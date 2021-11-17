import { useCallback, useMemo } from "react"

import { Requestable, RequestStatus } from "@/types"
import { AccountSummaries } from "@/types/ga4/StreamPicker"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"
import { useSelector } from "react-redux"

type AccountSummariesResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAccountSummariesResponse
const getAccountSummaries = (response: AccountSummariesResponse) =>
  response.accountSummaries
const getPageToken = (response: AccountSummariesResponse) =>
  response.nextPageToken

const useAccountSummaries = (): Requestable<AccountSummaries> => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const adminAPI = useMemo(() => gapi?.client?.analyticsadmin, [gapi])

  const requestReady = useMemo(() => adminAPI !== undefined, [adminAPI])

  const paginatedRequest = useCallback(
    async (pageToken: string | undefined) => {
      if (adminAPI === undefined) {
        throw new Error(
          "invalid invariant. adminAPI cannot be undefined when this method is called."
        )
      }
      return await adminAPI.accountSummaries.list({ pageToken })
    },
    [adminAPI]
  )

  const requestAccountSummaries = usePaginatedCallback(
    requestReady,
    "invalid invariant. adminAPI cannot be undefined when this method is called.",
    paginatedRequest,
    getAccountSummaries,
    getPageToken
  )

  const accountSummariesRequest = useCached(
    StorageKey.ga4AccountSummaries,
    requestAccountSummaries,
    moment.duration(5, "minutes"),
    requestReady
  )

  switch (accountSummariesRequest.status) {
    case RequestStatus.Successful: {
      const accountSummaries = accountSummariesRequest.value || []
      return {
        status: accountSummariesRequest.status,
        accounts: accountSummaries,
      }
    }
    default:
      return { status: accountSummariesRequest.status }
  }
}

export default useAccountSummaries
