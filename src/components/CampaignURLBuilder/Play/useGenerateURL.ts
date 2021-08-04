import { useMemo } from "react"
import { AdNetwork } from "../adNetworks"

interface Arg {
  adNetwork: AdNetwork
  appID: string | undefined
  source: string | undefined
  medium: string | undefined
  term: string | undefined
  content: string | undefined
  name: string | undefined
}

const useGenerateUrl = (arg: Arg): string | undefined => {
  return useMemo(() => {
    if (!arg.appID || !arg.source) {
      return undefined
    }

    const urlParams = new URLSearchParams()

    urlParams.append("id", arg.appID)

    const encodedParamsString = new URLSearchParams()
    encodedParamsString.append("utm_source", arg.source)
    if (arg.medium) {
      encodedParamsString.append("utm_medium", arg.medium)
    }
    if (arg.term) {
      encodedParamsString.append("utm_term", arg.term)
    }
    if (arg.content) {
      encodedParamsString.append("utm_content", arg.content)
    }
    if (arg.name) {
      encodedParamsString.append("utm_campaign", arg.name)
    }
    if (arg.adNetwork.networkId) {
      encodedParamsString.append("anid", arg.adNetwork.networkId)
    }
    if (arg.adNetwork.clickId) {
      encodedParamsString.append("aclid", arg.adNetwork.clickId)
    }
    if (arg.adNetwork.customFields) {
      arg.adNetwork.customFields.forEach(({ name, value }) => {
        encodedParamsString.append(name, value)
      })
    }

    urlParams.append("referrer", encodedParamsString.toString())

    // TODO - If there are issues with these parameters, uncomment the
    // following code.
    //
    // const queryString = urlParams
    //   .toString()
    //   .replaceAll("%257Bclick_id%257D", "{click_id}")
    //   .replaceAll("%257Bapp_id%257D", "{app_id}")
    const queryString = urlParams.toString()

    return `https://play.google.com/store/apps/details?${queryString}`
  }, [arg])
}

export default useGenerateUrl
