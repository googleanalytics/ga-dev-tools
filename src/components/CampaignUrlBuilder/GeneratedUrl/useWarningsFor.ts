import { useState, useMemo, useCallback, useEffect } from "react"

import { usePersistentBoolean } from "../../../hooks"
import { StorageKey, GAVersion } from "../../../constants"
import { websiteUrlFor } from "../params"
import { Dispatch } from "../../../types"
import useShortenLink from "./useShortenLink"

type UseWarningsFor = (arg: {
  version: GAVersion
  websiteUrl: string
  source: string
  medium: string
  campaign: string
  id: string
  content: string | undefined
  term: string | undefined
  shorten: ReturnType<typeof useShortenLink>["shorten"]
}) => {
  generatedUrl: string
  hasAllRequired: boolean
  problematicUrl: boolean
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
  websiteUrl,
  source,
  medium,
  campaign,
  id,
  content,
  term,
  shorten,
}) => {
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [problematicUrl, setProblematicUrl] = useState(false)
  const [longLink, setLongLink] = useState<string>(generatedUrl)
  const [shortLink, setShortLink] = useState<string>()
  const [showShort, setShowShort] = useState(false)
  const [useFragment, setUseFragment] = usePersistentBoolean(
    StorageKey.campaignBuilderUseFragment,
    false
  )

  const hasAllRequired = useMemo(() => {
    if (version === GAVersion.UniversalAnalytics) {
      if (websiteUrl === "" || source === "") {
        return false
      }
      return true
    }
    if (websiteUrl === "" || source === "" || medium === "" || id === "") {
      return false
    }
    return true
  }, [websiteUrl, source, medium, id, version])

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
      setGeneratedUrl("")
      setLongLink("")
      return
    }
    const generated = websiteUrlFor(
      websiteUrl,
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
    setGeneratedUrl(generated)
    setLongLink(generated)
  }, [
    hasAllRequired,
    useFragment,
    websiteUrl,
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
    websiteUrl,
    source,
    medium,
    campaign,
    term,
    content,
  ])

  const onWarning = useCallback<ReturnType<UseWarningsFor>["onWarning"]>(
    warningPresent => setProblematicUrl(warningPresent),
    [setProblematicUrl]
  )

  return {
    generatedUrl,
    hasAllRequired,
    problematicUrl,
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
