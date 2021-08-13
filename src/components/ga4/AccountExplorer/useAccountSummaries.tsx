import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import { RequestStatus } from "@/types"
import { useCallback, useMemo, useState } from "react"
import { useSelector } from "react-redux"

type AccountSummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAccountSummary

const useAccountSummaries = () => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)

  const requestAccountSummaries = useCallback(async () => {
    try {
      if (adminAPI === undefined) {
        throw new Error(
          "invalid invariant. adminAPI cannot be undefined when this method is called."
        )
      }
      setRequestStatus(RequestStatus.InProgress)
      let pageToken: string | undefined = undefined
      let accountSummaries: AccountSummary[] = []
      do {
        pageToken = undefined
        const { result } = await adminAPI.accountSummaries.list({
          pageToken,
        })

        accountSummaries = accountSummaries.concat(
          result.accountSummaries || []
        )

        if (result.nextPageToken) {
          pageToken = result.nextPageToken
        }
      } while (pageToken !== undefined)
      setRequestStatus(RequestStatus.Successful)
    } catch (e) {
      setRequestStatus(RequestStatus.Failed)
    }
  }, [adminAPI])

  if (requestStatus === RequestStatus.NotStarted) {
    return { status: requestStatus }
  }
  if (requestStatus === RequestStatus.Successful) {
    return { status: requestStatus, accountSummaries }
  }
}

export default useAccountSummaries
