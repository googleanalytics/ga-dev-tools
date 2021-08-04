import { useState, useMemo, useCallback, useEffect } from "react"

import { usePersistentBoolean } from "@/hooks"
import { StorageKey, GAVersion } from "@/constants"
import { Dispatch } from "@/types"
import { websiteURLFor } from "../params"
import useShortenLink from "./useShortenLink"

type UseWarningsFor = (arg: {
  version: GAVersion
  websiteURL: string
  source: string
  medium: string
  campaign: string
  id: string
  content: string | undefined
  term: string | undefined
  shorten: ReturnType<typeof useShortenLink>["shorten"]
}) => {
  generatedURL: string
  hasAllRequired: boolean
  problematicURL: boolean
  longLink: string
  shortLink: string | undefined
  showShort: boolean
  useFragment: boolean
  setUseFragment: Dispatch<boolean>
  onWarning: (warning: boolean) => void
  shortenLinkGui: () => void
}
const useWarningsFor: UseWarningsFor = ({
  version,
  websiteURL,
  source,
  medium,
  campaign,
  id,
  content,
  term,
  shorten,
}) => {
  const [generatedURL, setGeneratedURL] = useState("")
  const [problematicURL, setProblematicURL] = useState(false)
  const [longLink, setLongLink] = useState<string>(generatedURL)
  const [shortLink, setShortLink] = useState<string>()
  const [showShort, setShowShort] = useState(false)
  const [useFragment, setUseFragment] = usePersistentBoolean(
    StorageKey.campaignBuilderUseFragment,
    false
  )

  const hasAllRequired = useMemo(() => {
    if (version === GAVersion.UniversalAnalytics) {
      if (websiteURL === "" || source === "") {
        return false
      }
      return true
    }
    if (websiteURL === "" || source === "" || medium === "") {
      return false
    }
    return true
  }, [websiteURL, source, medium, version])

  const shortenLinkGui = useCallback(() => {
    if (showShort === true) {
      // We're currently showing the short url and the user clicked "Show full
      // URL". Set show short to false and return.
      setShowShort(false)
      return
    }
    // We can't shorten bit.ly links or links that are empty.
    if (longLink === "" || longLink?.startsWith("https://bit.ly")) {
      return
    }
    shorten(longLink).then(({ longLink, shortLink }) => {
      setLongLink(longLink)
      setShortLink(shortLink)
      setShowShort(true)
    })
  }, [longLink, shorten, showShort])

  const setGeneratedFromInput = useCallback(() => {
    if (!hasAllRequired) {
      setGeneratedURL("")
      setLongLink("")
      return
    }
    const generated = websiteURLFor(
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
    setGeneratedURL(generated)
    setLongLink(generated)
  }, [
    hasAllRequired,
    useFragment,
    websiteURL,
    source,
    medium,
    campaign,
    id,
    term,
    content,
  ])
  // TODO - this can probably be fixed with useMemo based on what past me said:
  // This is a bit of a hack, but I don't want to duplicate the code that sets
  // the generated url.
  useEffect(() => {
    setGeneratedFromInput()
    setShortLink(undefined)
    setShowShort(false)
  }, [
    hasAllRequired,
    setGeneratedFromInput,
    useFragment,
    websiteURL,
    source,
    medium,
    campaign,
    term,
    content,
  ])

  const onWarning = useCallback<ReturnType<UseWarningsFor>["onWarning"]>(
    warningPresent => setProblematicURL(warningPresent),
    [setProblematicURL]
  )

  return {
    generatedURL,
    hasAllRequired,
    problematicURL,
    longLink,
    shortLink,
    showShort,
    useFragment,
    setUseFragment,
    shortenLinkGui,
    onWarning,
  }
}

export default useWarningsFor
