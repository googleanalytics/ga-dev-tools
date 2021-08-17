import { StorageKey } from "@/constants"
import { useKeyedHydratedPersistantObject } from "@/hooks/useHydrated"
import { Dispatch, successful } from "@/types"
import { AccountSummary, PropertySummary } from "@/types/ga4/StreamPicker"
import { useCallback } from "react"
import useAccounts from "./useAccounts"

export interface AccountProperty {
  account: AccountSummary | undefined
  property: PropertySummary | undefined
}

export interface AccountPropertySetters {
  setAccountID: Dispatch<string | undefined>
  setPropertyID: Dispatch<string | undefined>
}

const useAccountProperty = (
  prefix: StorageKey,
  queryParamKeys: { Account: string; Property: string; Stream: string },
  // TODO - This is only here because there seems to be a bug with
  // use-query-params replaceIn functionality where it also removes the anchor.
  // Need to do a minimum repro and file a bug to that repo.
  keepParam: boolean = false,
  onSetProperty?: (p: PropertySummary | undefined) => void
): AccountProperty & AccountPropertySetters => {
  const accountsRequest = useAccounts()

  const getAccountByID = useCallback(
    (id: string | undefined) => {
      if (!successful(accountsRequest) || id === undefined) {
        return undefined
      }
      return successful(accountsRequest)?.accounts.find(a => a.name === id)
    },
    [accountsRequest]
  )

  const [
    account,
    setAccountID,
  ] = useKeyedHydratedPersistantObject<AccountSummary>(
    `${prefix}-account` as StorageKey,
    queryParamKeys.Account,
    getAccountByID,
    undefined,
    { keepParam }
  )

  const getPropertyByID = useCallback(
    (id: string | undefined) => {
      if (!successful(accountsRequest) || id === undefined) {
        return undefined
      }
      return successful(accountsRequest)
        ?.accounts.flatMap(a => a.propertySummaries || [])
        .find(p => p.property === id)
    },
    [accountsRequest]
  )

  const [
    property,
    setPropertyID,
  ] = useKeyedHydratedPersistantObject<PropertySummary>(
    `${prefix}-property` as StorageKey,
    queryParamKeys.Property,
    getPropertyByID,
    onSetProperty,
    { keepParam }
  )

  return {
    account,
    setAccountID,
    property,
    setPropertyID,
  }
}

export default useAccountProperty
