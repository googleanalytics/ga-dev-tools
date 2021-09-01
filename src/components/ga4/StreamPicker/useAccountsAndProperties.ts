import { useMemo } from "react"

import { Requestable, RequestStatus, successful } from "@/types"
import { AccountSummary, PropertySummary } from "@/types/ga4/StreamPicker"
import useAccounts from "./useAccounts"

const useAccountsAndProperties = (
  account: AccountSummary | undefined
): Requestable<{
  accounts: AccountSummary[]
  properties: PropertySummary[]
}> => {
  const accountsRequest = useAccounts()

  const accounts = useMemo(() => successful(accountsRequest)?.accounts, [
    accountsRequest,
  ])

  const properties = useMemo(() => {
    if (accounts === undefined) {
      return undefined
    }
    if (account === undefined) {
      return []
    }
    return accounts.find(a => a.name === account.name)?.propertySummaries || []
  }, [accounts, account])

  return useMemo(() => {
    if (accountsRequest.status === RequestStatus.Successful) {
      if (accounts === undefined || properties === undefined) {
        throw new Error(
          "Invalid invariant: accounts & properties must be defined here."
        )
      }
      return { status: accountsRequest.status, accounts, properties }
    }
    return { status: accountsRequest.status }
  }, [accountsRequest, accounts, properties])
}

export default useAccountsAndProperties
