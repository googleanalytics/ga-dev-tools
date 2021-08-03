import { StorageKey } from "@/constants"
import { useHydratedPersistantString } from "@/hooks/useHydrated"
import { useEffect, useState } from "react"
import { supportedAdNetworks } from "../adNetworks"

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
}

const useInputs = () => {
  const [adNetwork, setAdNetwork] = useState(supportedAdNetworks[0])

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

  useEffect(() => {
    if (adNetwork.networkId) {
      setSource(adNetwork.networkId)
    }
    if (adNetwork.label === "Custom") {
      setSource("")
    }
  }, [adNetwork, setSource])

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
  }
}

export default useInputs
