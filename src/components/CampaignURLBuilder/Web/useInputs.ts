import { useCallback } from "react"

import { usePersistentString } from "@/hooks"
import { StorageKey } from "@/constants"
import { extractParamsFromWebsiteURL } from "./params"

const useInputs = () => {
  const [websiteURL, setWebsiteURL] = usePersistentString(
    StorageKey.campaignBuilderWebsiteURL,
    ""
  )
  const [source, setSource] = usePersistentString(
    StorageKey.campaignBuilderSource,
    ""
  )
  const [medium, setMedium] = usePersistentString(
    StorageKey.campaignBuilderMedium,
    ""
  )
  const [campaign, setCampaign] = usePersistentString(
    StorageKey.campaignBuilderName,
    ""
  )
  const [id, setID] = usePersistentString(StorageKey.campaignBuilderID, "")
  const [term, setTerm] = usePersistentString(
    StorageKey.campaignBuilderTerm,
    ""
  )
  const [content, setContent] = usePersistentString(
    StorageKey.campaignBuilderContent,
    ""
  )

  const onWebsiteChange = useCallback(
    e => {
      const extractedParams = extractParamsFromWebsiteURL(e.target.value)
      if (extractedParams !== undefined) {
        const {
          utm_id,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
        } = extractedParams
        utm_id !== undefined && setID(utm_id)
        utm_source !== undefined && setSource(utm_source)
        utm_medium !== undefined && setMedium(utm_medium)
        utm_campaign !== undefined && setCampaign(utm_campaign)
        utm_term !== undefined && setTerm(utm_term)
        utm_content !== undefined && setContent(utm_content)
      }
      setWebsiteURL(e.target.value)
    },
    [
      setCampaign,
      setMedium,
      setSource,
      setTerm,
      setContent,
      setWebsiteURL,
      setID,
    ]
  )

  return {
    websiteURL,
    source,
    setSource,
    medium,
    setMedium,
    campaign,
    setCampaign,
    id,
    setID,
    term,
    setTerm,
    content,
    setContent,
    onWebsiteChange,
  }
}

export default useInputs
