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
}

const useInputs = () => {
  const [adNetwork, setAdNetwork] = useState(supportedAdNetworks[0])

  const [appID, setAppID] = useHydratedPersistantString(
    StorageKey.campaignBuilderPlayAppID,
    QueryParam.AppID,
    ""
  )
  const [source, setSource] = useHydratedPersistantString(
    StorageKey.campaignBuilderPlaySource,
    QueryParam.Source,
    ""
  )
  const [medium, setMedium] = useHydratedPersistantString(
    StorageKey.campaignBuilderPlayMedium,
    QueryParam.Medium,
    ""
  )
  const [term, setTerm] = useHydratedPersistantString(
    StorageKey.campaignBuilderPlayTerm,
    QueryParam.Term,
    ""
  )
  const [content, setContent] = useHydratedPersistantString(
    StorageKey.campaignBuilderPlayContent,
    QueryParam.Content,
    ""
  )
  const [name, setName] = useHydratedPersistantString(
    StorageKey.campaignBuilderPlayName,
    QueryParam.Name,
    ""
  )

  useEffect(() => {
    if (adNetwork.networkID) {
      setSource(adNetwork.networkID)
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
  }
}

export default useInputs
