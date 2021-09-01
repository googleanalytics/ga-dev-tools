import { useCallback, useMemo } from "react"

import useGapi from "@/hooks/useGapi"
import { Requestable, RequestStatus } from "@/types"
import { AccountSummaries } from "@/types/ga4/StreamPicker"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"

type AccountSummariesResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAccountSummariesResponse
const getAccountSummaries = (response: AccountSummariesResponse) =>
  response.accountSummaries
const getPageToken = (response: AccountSummariesResponse) =>
  response.nextPageToken

const useAccountSummaries = (): Requestable<AccountSummaries> => {
  const gapi = useGapi()
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])

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
