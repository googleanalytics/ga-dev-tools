import { StorageKey } from "@/constants"
import { useKeyedHydratedPersistantObject } from "@/hooks/useHydrated"
import { Dispatch, RequestStatus } from "@/types"
import {
  AccountSummary,
  PropertySummary,
  Stream,
} from "@/types/ga4/StreamPicker"
import { useCallback } from "react"
import useAccounts from "./useAccounts"
import useStreams from "./useStreams"

export interface AccountPropertyStream {
  account: AccountSummary | undefined
  property: PropertySummary | undefined
  stream: Stream | undefined
}

interface AccountPropertyStreamSetters {
  setAccountID: Dispatch<string | undefined>
  setPropertyID: Dispatch<string | undefined>
  setStreamID: Dispatch<string | undefined>
}

const useAccountPropertyStream = (
  prefix: StorageKey,
  queryParamKeys: { Account: string; Property: string; Stream: string },
  // TODO - This is only here because there seems to be a bug with
  // use-query-params replaceIn functionality where it also removes the anchor.
  // Need to do a minimum repro and file a bug to that repo.
  keepParam: boolean = false
): AccountPropertyStream & AccountPropertyStreamSetters => {
  const accountsRequest = useAccounts()

  const getAccountByID = useCallback(
    (id: string | undefined) => {
      if (
        accountsRequest.status !== RequestStatus.Successful ||
        id === undefined
      ) {
        return undefined
      }
      return accountsRequest.accounts.find(a => a.name === id)
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
      if (
        accountsRequest.status !== RequestStatus.Successful ||
        id === undefined
      ) {
        return undefined
      }
      return accountsRequest.accounts
        .flatMap(a => a.propertySummaries || [])
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
    undefined,
    { keepParam }
  )

  const streamsRequest = useStreams(property)

  const getStreamsByID = useCallback(
    (id: string | undefined) => {
      if (
        streamsRequest.status !== RequestStatus.Successful ||
        id === undefined
      ) {
        return undefined
      }
      return streamsRequest.streams.find(s => s.name === id)
    },
    [streamsRequest]
  )

  const [stream, setStreamID] = useKeyedHydratedPersistantObject<Stream>(
    `${prefix}-stream` as StorageKey,
    queryParamKeys.Stream,
    getStreamsByID,
    undefined,
    { keepParam }
  )

  return {
    account,
    setAccountID,
    property,
    setPropertyID,
    stream,
    setStreamID,
  }
}

export default useAccountPropertyStream
