import { useMemo } from "react"
import { websiteURLFor } from "../params"

interface Arg {
  websiteURL?: string
  source?: string
  medium?: string
  campaign?: string
  id?: string
  term?: string
  content?: string
  useFragment: boolean
}

const useGenerateURL = ({
  websiteURL,
  source,
  medium,
  campaign,
  id,
  term,
  content,
  useFragment,
}: Arg) => {
  return useMemo(() => {
    if (websiteURL === undefined) {
      return undefined
    }
    return websiteURLFor(
      websiteURL,
      {
        utm_source: source || undefined,
        utm_medium: medium || undefined,
        utm_campaign: campaign || undefined,
        utm_id: id || undefined,
        utm_term: term || undefined,
        utm_content: content || undefined,
      },
      useFragment
    )
  }, [useFragment, websiteURL, source, medium, campaign, id, term, content])
}

export default useGenerateURL
