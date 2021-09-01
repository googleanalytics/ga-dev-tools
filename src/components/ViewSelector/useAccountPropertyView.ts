import { StorageKey } from "@/constants"
import { useKeyedHydratedPersistantObject } from "@/hooks/useHydrated"
import { Dispatch, RequestStatus } from "@/types"
import { useCallback } from "react"
import useFlattenedViews from "./useFlattenedViews"

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary

export interface UAAccountPropertyView {
  account?: AccountSummary
  property?: WebPropertySummary
  view?: ProfileSummary
}

interface UAAccountPropertyViewSetters {
  setAccountID: Dispatch<string | undefined>
  setPropertyID: Dispatch<string | undefined>
  setViewID: Dispatch<string | undefined>
}

const useAccountPropertyView = (
  prefix: StorageKey,
  queryParamKeys: { Account: string; Property: string; View: string },
  onSetView?: (p: ProfileSummary | undefined) => void
): UAAccountPropertyView & UAAccountPropertyViewSetters => {
  const flattenedViewsRequest = useFlattenedViews()

  const getAccountByID = useCallback(
    (id: string | undefined) => {
      if (
        flattenedViewsRequest.status !== RequestStatus.Successful ||
        id === undefined
      ) {
        return undefined
      }
      return flattenedViewsRequest.flattenedViews.find(
        flattenedView => flattenedView.account?.id === id
      )?.account
    },
    [flattenedViewsRequest]
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
      if (
        flattenedViewsRequest.status !== RequestStatus.Successful ||
        id === undefined
      ) {
        return undefined
      }
      return flattenedViewsRequest.flattenedViews.find(
        flattenedView => flattenedView.property?.id === id
      )?.property
    },
    [flattenedViewsRequest]
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
      if (
        flattenedViewsRequest.status !== RequestStatus.Successful ||
        id === undefined
      ) {
        return undefined
      }
      return flattenedViewsRequest.flattenedViews.find(
        flattenedView => flattenedView.view?.id === id
      )?.view
    },
    [flattenedViewsRequest]
  )

  const [view, setViewID] = useKeyedHydratedPersistantObject<ProfileSummary>(
    `${prefix}-view` as StorageKey,
    queryParamKeys.View,
    getViewByID,
    onSetView
  )

  return { account, setAccountID, property, setPropertyID, view, setViewID }
}

export default useAccountPropertyView
