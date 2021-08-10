import { useMemo } from "react"
import useAccounts from "./useAccounts"

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary

const useViewSelector = (
  account: AccountSummary | undefined,
  property: WebPropertySummary | undefined
): {
  accounts: AccountSummary[] | undefined
  properties: WebPropertySummary[] | undefined
  views: ProfileSummary[] | undefined
} => {
  const accounts = useAccounts()

  const properties = useMemo(() => {
    if (account === undefined || accounts === undefined) {
      return undefined
    }
    const a = accounts.find(a => a.id === account.id)
    if (a === undefined) {
      return undefined
    }
    return a.webProperties || []
  }, [accounts, account])

  const views = useMemo(() => {
    if (property === undefined || properties === undefined) {
      return undefined
    }
    const p = properties.find(p => p.id === property.id)
    if (p === undefined) {
      return []
    }
    return p.profiles || []
  }, [properties, property])

  return {
    accounts,
    properties,
    views,
  }
}

export default useViewSelector
