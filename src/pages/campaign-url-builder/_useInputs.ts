import { usePersistentString } from "../../hooks"
import { StorageKey } from "../../constants"
import { useCallback } from "react"
import { extractParamsFromWebsiteUrl } from "./_params"

const useInputs = () => {
  const [websiteUrl, setWebsiteUrl] = usePersistentString(
    StorageKey.campaignBuilderWebsiteUrl,
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
      const extractedParams = extractParamsFromWebsiteUrl(e.target.value)
      if (extractedParams !== undefined) {
        const {
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
        } = extractedParams
        utm_source !== undefined && setSource(utm_source)
        utm_medium !== undefined && setMedium(utm_medium)
        utm_campaign !== undefined && setCampaign(utm_campaign)
        utm_term !== undefined && setTerm(utm_term)
        utm_content !== undefined && setContent(utm_content)
      }
      setWebsiteUrl(e.target.value)
    },
    [setCampaign, setMedium, setSource, setTerm, setContent, setWebsiteUrl]
  )

  return {
    websiteUrl,
    source,
    setSource,
    medium,
    setMedium,
    campaign,
    setCampaign,
    term,
    setTerm,
    content,
    setContent,
    onWebsiteChange,
  }
}

export default useInputs
