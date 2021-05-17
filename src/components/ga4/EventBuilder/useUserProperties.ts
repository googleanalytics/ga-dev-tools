import { StorageKey } from "@/constants"
import { useAddToArray, useRemoveByIndex, useUpdateByIndex } from "@/hooks"
import { useHydratedPersistantObject } from "@/hooks/useHydrated"
import { useCallback } from "react"
import { numberParam, stringParam } from "./event"
import { Parameter, UrlParam } from "./types"
import { ParametersParam } from "./useEvent"

const useUserProperties = () => {
  const [userProperties, setUserProperties] = useHydratedPersistantObject<
    Parameter[]
  >(
    StorageKey.ga4EventBuilderUserProperties,
    UrlParam.UserProperties,
    ParametersParam
  )

  const addUserProperty = useAddToArray(setUserProperties)

  const addStringUserProperty = useCallback(() => {
    addUserProperty(stringParam("", undefined))
  }, [addUserProperty])

  const addNumberUserProperty = useCallback(() => {
    addUserProperty(numberParam("", undefined))
  }, [addUserProperty])

  const removeUserProperty = useRemoveByIndex(setUserProperties)

  const updateUserProperty = useUpdateByIndex(setUserProperties)

  const setUserPropertyName = useCallback(
    (idx: number, name: string) => {
      updateUserProperty(idx, old => ({ ...old, name }))
    },
    [updateUserProperty]
  )

  const setUserPopertyValue = useCallback(
    (idx: number, value: string) => {
      updateUserProperty(idx, old => ({ ...old, value }))
    },
    [updateUserProperty]
  )

  return {
    userProperties: userProperties || [],
    addStringUserProperty,
    addNumberUserProperty,
    removeUserProperty,
    setUserPopertyValue,
    setUserPropertyName,
  }
}

export default useUserProperties
