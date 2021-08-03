import { StorageKey } from "@/constants"
import { useUpdateByIndex } from "@/hooks"
import {
  useHydratedPersistantObject,
  useHydratedPersistantString,
} from "@/hooks/useHydrated"
import { useCallback, useEffect } from "react"
import { QueryParamConfig } from "use-query-params"
import { AdNetwork, CustomField, supportedAdNetworks } from "../adNetworks"

enum QueryParam {
  AppID = "a",
  Source = "b",
  Medium = "c",
  Term = "d",
  Content = "e",
  Name = "f",
  PropertyID = "g",
  RedirectURL = "h",
  DeviceID = "i",
  CustomFields = "j",
  AdNetwork = "k",
}

const customFieldsParam: QueryParamConfig<CustomField[] | undefined | null> = {
  encode: v => (v ? btoa(JSON.stringify(v)) : undefined),
  decode: a => (typeof a === "string" ? JSON.parse(atob(a)) : undefined),
}

const adNetworkParam: QueryParamConfig<AdNetwork | undefined | null> = {
  encode: v => (v ? btoa(JSON.stringify(v)) : undefined),
  decode: a => (typeof a === "string" ? JSON.parse(atob(a)) : undefined),
}

const useInputs = () => {
  const [adNetwork, setAdNetworkLocal] = useHydratedPersistantObject<AdNetwork>(
    StorageKey.campaignBuilderIOSAdNetwork,
    QueryParam.AdNetwork,
    adNetworkParam,
    supportedAdNetworks[0]
  )

  const [appID, setAppID] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSAppId,
    QueryParam.AppID,
    ""
  )
  const [source, setSource] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSSource,
    QueryParam.Source,
    ""
  )
  const [medium, setMedium] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSMedium,
    QueryParam.Medium,
    ""
  )
  const [term, setTerm] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSTerm,
    QueryParam.Term,
    ""
  )
  const [content, setContent] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSContent,
    QueryParam.Content,
    ""
  )
  const [name, setName] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSName,
    QueryParam.Name,
    ""
  )

  const [propertyID, setPropertyID] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSPropertyId,
    QueryParam.PropertyID,
    ""
  )

  const [redirectURL, setRedirectURL] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSRedirectURL,
    QueryParam.RedirectURL,
    ""
  )

  const [deviceID, setDeviceID] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSDeviceID,
    QueryParam.DeviceID,
    ""
  )

  const [customFields, setCustomFields] = useHydratedPersistantObject<
    CustomField[]
  >(
    StorageKey.campaignBuilderIOSCustomFields,
    QueryParam.CustomFields,
    customFieldsParam,
    adNetwork?.customFields || []
  )

  const updateCustomField = useUpdateByIndex(setCustomFields)

  useEffect(() => {
    setDeviceID(adNetwork?.deviceId)
  }, [adNetwork, setDeviceID])

  const setAdNetwork = useCallback(
    (nu: AdNetwork) => {
      setAdNetworkLocal(nu)
      setDeviceID(nu.deviceId)
      setCustomFields(nu.customFields)
      if (nu.label === "Custom") {
        setSource("")
      } else {
        setSource(nu.networkId)
      }
    },
    [setAdNetworkLocal, setCustomFields, setDeviceID, setSource]
  )

  return {
    appID,
    setAppID,
    source,
    setSource,
    medium,
    setMedium,
    term,
    setTerm,
    content,
    setContent,
    name,
    setName,
    adNetwork,
    setAdNetwork,
    propertyID,
    setPropertyID,
    redirectURL,
    setRedirectURL,
    deviceID,
    setDeviceID,
    customFields,
    updateCustomField,
  }
}

export default useInputs
