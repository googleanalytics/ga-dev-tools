import { AccountSummary } from "@/api"
import { GAVersion, StorageKey } from "@/constants"
import { useUpdateByIndex } from "@/hooks"
import {
  useHydratedPersistantObject,
  useHydratedPersistantString,
} from "@/hooks/useHydrated"
import { PropertySummary } from "@/types/ga4/StreamPicker"
import { decodeObject, encodeObject } from "@/url"
import { useCallback, useEffect, useMemo } from "react"
import { QueryParamConfig } from "use-query-params"
import { AdNetwork, CustomField, supportedAdNetworks } from "../adNetworks"

enum QueryParam {
  AppID = "a",
  Source = "b",
  Medium = "c",
  Term = "d",
  Content = "e",
  Name = "f",
  RedirectURL = "g",
  DeviceID = "h",
  CustomFields = "i",
  AdNetwork = "j",
  Method = "k",
  GA4Account = "l",
  GA4Property = "m",
  PropertyIDUA = "n",
  PropertyIDGA4 = "o",
}

const customFieldsParam: QueryParamConfig<CustomField[] | undefined | null> = {
  encode: v => (v ? encodeObject(v) : undefined),
  decode: a => (typeof a === "string" ? decodeObject(a) : undefined),
}

const adNetworkParam: QueryParamConfig<AdNetwork | undefined | null> = {
  encode: v => (v ? encodeObject(v) : undefined),
  decode: a => (typeof a === "string" ? decodeObject(a) : undefined),
}

const ga4AccountParam: QueryParamConfig<AccountSummary | undefined | null> = {
  encode: v => (v ? encodeObject(v) : undefined),
  decode: a => (typeof a === "string" ? decodeObject(a) : undefined),
}

const ga4PropertyParam: QueryParamConfig<PropertySummary | undefined | null> = {
  encode: v => (v ? encodeObject(v) : undefined),
  decode: a => (typeof a === "string" ? decodeObject(a) : undefined),
}

const useInputs = (version: GAVersion) => {
  const [adNetwork, setAdNetworkLocal] = useHydratedPersistantObject<AdNetwork>(
    StorageKey.campaignBuilderIOSAdNetwork,
    QueryParam.AdNetwork,
    adNetworkParam,
    supportedAdNetworks[0]
  )

  const [appID, setAppID] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSAppID,
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

  const [
    ga4Account,
    setGA4Account,
  ] = useHydratedPersistantObject<AccountSummary>(
    StorageKey.campaignBuilderIOSGA4Account,
    QueryParam.GA4Account,
    ga4AccountParam
  )

  const [
    ga4Property,
    setGA4PropertyLocal,
  ] = useHydratedPersistantObject<PropertySummary>(
    StorageKey.campaignBuilderIOSGA4Property,
    QueryParam.GA4Property,
    ga4PropertyParam
  )

  const [uaPropertyID, setUAPropertyID] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSPropertyIDUA,
    QueryParam.PropertyIDUA,
    ""
  )
  const [ga4PropertyID, setGA4PropertyID] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSPropertyIDGA4,
    QueryParam.PropertyIDGA4,
    ""
  )

  const [propertyID, setPropertyID] = useMemo<
    ReturnType<typeof useHydratedPersistantString>
  >(() => {
    if (version === GAVersion.GoogleAnalytics4) {
      return [ga4PropertyID, setGA4PropertyID]
    } else {
      return [uaPropertyID, setUAPropertyID]
    }
  }, [version, uaPropertyID, setUAPropertyID, ga4PropertyID, setGA4PropertyID])

  const setGA4Property = useCallback<typeof setGA4PropertyLocal>(
    property => {
      setGA4PropertyLocal(old => {
        let nu: PropertySummary | undefined = undefined
        if (typeof property === "function") {
          nu = property(old)
          return nu
        } else {
          nu = property
        }
        if (nu !== undefined) {
          setPropertyID(nu.property?.replace("properties/", ""))
        }
        return nu
      })
    },
    [setGA4PropertyLocal, setPropertyID]
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

  const [method, setMethod] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSMethod,
    QueryParam.Method,
    "redirect"
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
    setDeviceID(adNetwork?.deviceID)
    setMethod(adNetwork?.method)
  }, [adNetwork, setDeviceID, setMethod])

  const setAdNetwork = useCallback(
    (nu: AdNetwork) => {
      setAdNetworkLocal(nu)
      setDeviceID(nu.deviceID)
      setCustomFields(nu.customFields)
      if (nu.label === "Custom") {
        setSource("")
      } else {
        setSource(nu.source || nu.networkID)
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
    method,
    setMethod,
    ga4Account,
    setGA4Account,
    ga4Property,
    setGA4Property,
  }
}

export default useInputs
