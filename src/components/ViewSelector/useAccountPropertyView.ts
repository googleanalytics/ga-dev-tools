import { StorageKey } from "@/constants"
import { useKeyedHydratedPersistantObject } from "@/hooks/useHydrated"
import { useCallback } from "react"
import useAccounts from "./useAccounts"
import {
  AccountSummary,
  ProfileSummary,
  WebPropertySummary,
} from "./useViewSelector"

const useAccountPropertyView = (
  prefix: StorageKey,
  queryParamKeys: { Account: string; Property: string; View: string }
) => {
  const accounts = useAccounts()

  const getAccountByID = useCallback(
    (id: string | undefined) => {
      if (accounts === undefined || id === undefined) {
        return undefined
      }
      return accounts.find(a => a.id === id)
    },
    [accounts]
  )

  const [
    account,
    setAccountID,
  ] = useKeyedHydratedPersistantObject<AccountSummary>(
    `${prefix}-account` as StorageKey,
    queryParamKeys.Account,
    getAccountByID
  )

  const getPropertyByID = useCallback(
    (id: string | undefined) => {
      if (accounts === undefined || id === undefined) {
        return undefined
      }
      return accounts.flatMap(a => a.webProperties || []).find(p => p.id === id)
    },
    [accounts]
  )

  const [
    property,
    setPropertyID,
  ] = useKeyedHydratedPersistantObject<WebPropertySummary>(
    `${prefix}-property` as StorageKey,
    queryParamKeys.Property,
    getPropertyByID
  )

  const getViewByID = useCallback(
    (id: string | undefined) => {
      if (accounts === undefined || id === undefined) {
        return undefined
      }
      return accounts
        .flatMap(a => a.webProperties || [])
        .flatMap(p => p.profiles || [])
        .find(p => p.id === id)
    },
    [accounts]
  )

  const [view, setViewID] = useKeyedHydratedPersistantObject<ProfileSummary>(
    `${prefix}-view` as StorageKey,
    queryParamKeys.View,
    getViewByID
  )

  return { account, setAccountID, property, setPropertyID, view, setViewID }
}

export default useAccountPropertyView
