import { useMemo } from "react"
import { AdNetwork } from "../adNetworks"

interface Arg {
  adNetwork: AdNetwork
  appId: string | undefined
  source: string | undefined
  medium: string | undefined
  term: string | undefined
  content: string | undefined
  name: string | undefined
  propertyId: string | undefined
  redirectURL: string | undefined
  deviceId: string
}

const useGenerateUrl = (arg: Arg): string | undefined => {
  return useMemo(() => {
    if (
      !arg.appId ||
      !arg.source ||
      !arg.propertyId ||
      (arg.adNetwork.method === "redirect" && !arg.redirectURL)
    ) {
      return undefined
    }

    const urlParams = new URLSearchParams()

    urlParams.append("tid", arg.propertyId)
    if (arg.redirectURL) {
      urlParams.append("url", arg.redirectURL)
    }
    urlParams.append("aid", arg.appId)
    urlParams.append("idfa", arg.deviceId)

    if (arg.source) {
      urlParams.append("cs", arg.source)
    }
    if (arg.medium) {
      urlParams.append("cm", arg.medium)
    }
    if (arg.name) {
      urlParams.append("cn", arg.name)
    }
    if (arg.content) {
      urlParams.append("cc", arg.content)
    }
    if (arg.term) {
      urlParams.append("ck", arg.term)
    }

    if (arg.adNetwork.networkId) {
      urlParams.append("anid", arg.adNetwork.networkId)
    }
    if (arg.adNetwork.clickId) {
      urlParams.append("aclid", arg.adNetwork.clickId)
    }

    // TODO - handle custom parameters
    // TODO - handle custom device id macro for "custom" option.

    if (arg.adNetwork.label === "Google AdMob") {
      urlParams.append("hash", "md5")
    }

    const queryString = urlParams.toString()

    return `https://play.google.com/store/apps/details?${queryString}`
  }, [arg])
}

export default useGenerateUrl
