import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import { Requestable, RequestStatus } from "@/types"
import { AccountSummary, ProfileSummary, WebPropertySummary } from "@/types/ua"
import moment from "moment"
import { useCallback, useMemo } from "react"

import { useSelector } from "react-redux"

interface Successful {
  accountSummaries: AccountSummary[]
  propertySummaries: WebPropertySummary[]
  profileSummaries: ProfileSummary[]
}

const useAccountSummaries = (
  accountSummary?: AccountSummary,
  propertySummary?: WebPropertySummary
): Requestable<Successful, {}, {}, { error?: any }> => {
  const gapi = useSelector((state: AppState) => state.gapi)

  const managementAPI = useMemo(() => {
    return gapi?.client?.analytics?.management
  }, [gapi])

  const requestAccountSummaries = useCallback(async (): Promise<
    AccountSummary[] | undefined
  > => {
    if (managementAPI === undefined) {
      throw new Error(
        "invalid invariant - fetchAccounts should never be called with an undefined managementAPI"
      )
    }
    const response = await managementAPI.accountSummaries.list({})
    return response.result.items
  }, [managementAPI])

  const requestReady = useMemo(() => managementAPI !== undefined, [
    managementAPI,
  ])

  const accountSummariesRequest = useCached(
    StorageKey.uaAccounts,
    requestAccountSummaries,
    moment.duration(5, "minutes"),
    requestReady
  )

  const accountFilter = useCallback(
    (a: AccountSummary) => {
      if (accountSummary === undefined) {
        return false
      }
      return a.id === accountSummary.id
    },
    [accountSummary]
  )

  const propertyFilter = useCallback(
    (p: WebPropertySummary) => {
      if (propertySummary === undefined) {
        return false
      }
      return propertySummary.id === p.id
    },
    [propertySummary]
  )

  return useMemo(() => {
    switch (accountSummariesRequest.status) {
      case RequestStatus.Successful: {
        const accountSummaries = accountSummariesRequest.value || []
        const propertySummaries = accountSummaries
          .filter(accountFilter)
          .flatMap(a => a.webProperties || [])
        const profileSummaries = propertySummaries
          .filter(propertyFilter)
          .flatMap(p => p.profiles || [])
        return {
          status: accountSummariesRequest.status,
          accountSummaries,
          propertySummaries,
          profileSummaries,
        }
      }
      case RequestStatus.Failed: {
        console.log({ accountSummariesRequest })
        return {
          status: accountSummariesRequest.status,
          error: accountSummariesRequest.error,
        }
      }
      default:
        return { status: accountSummariesRequest.status }
    }
  }, [accountSummariesRequest, accountFilter, propertyFilter])
}

export default useAccountSummaries
