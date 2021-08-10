import { AccountSummary } from "@/api"
import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import moment from "moment"
import { useCallback, useMemo } from "react"

import { useSelector } from "react-redux"

const useAccounts = (): AccountSummary[] | undefined => {
  const gapi = useSelector((state: AppState) => state.gapi)

  const managementAPI = useMemo(() => {
    return gapi?.client.analytics.management
  }, [gapi])

  const fetchAccounts = useCallback(async (): Promise<
    AccountSummary[] | undefined
  > => {
    if (managementAPI === undefined) {
      return Promise.resolve(undefined)
    }
    const response = await managementAPI.accountSummaries.list({})
    return response.result.items
  }, [managementAPI])

  const accounts = useCached(
    StorageKey.uaAccounts,
    fetchAccounts,
    moment.duration(5, "minutes")
  )

  return accounts
}

export default useAccounts
