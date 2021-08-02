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
  PropertyId = "g",
}

const useInputs = () => {
  const [adNetwork, setAdNetwork] = useState(supportedAdNetworks[0])

  const [appId, setAppId] = useHydratedPersistantString(
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

  const [propertyId, setPropertyId] = useHydratedPersistantString(
    StorageKey.campaignBuilderIOSPropertyId,
    QueryParam.PropertyId,
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
    appId,
    setAppId,
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
    propertyId,
    setPropertyId,
  }
}

export default useInputs
