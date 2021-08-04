import { useMemo } from "react"
import { AdNetwork, CustomField } from "../adNetworks"

interface Arg {
  adNetwork: AdNetwork | undefined
  appID: string | undefined
  source: string | undefined
  medium: string | undefined
  term: string | undefined
  content: string | undefined
  name: string | undefined
  propertyID: string | undefined
  redirectURL: string | undefined
  deviceID: string | undefined
  customFields: CustomField[] | undefined
  method: string | undefined
}

const useGenerateURL = (arg: Arg): string | undefined => {
  return useMemo(() => {
    if (
      !arg.appID ||
      !arg.source ||
      !arg.propertyID ||
      !arg.deviceID ||
      arg.adNetwork === undefined ||
      (arg.method === "redirect" && !arg.redirectURL)
    ) {
      return undefined
    }

    const urlParams = new URLSearchParams()

    urlParams.append("tid", arg.propertyID)
    if (arg.redirectURL) {
      urlParams.append("url", arg.redirectURL)
    }
    urlParams.append("aid", arg.appID)
    urlParams.append("idfa", arg.deviceID)

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

    if (arg.customFields) {
      arg.customFields.forEach(customField => {
        urlParams.append(customField.name, customField.value)
      })
    }

    if (arg.adNetwork.label === "Google AdMob") {
      urlParams.append("hash", "md5")
    }

    const queryString = urlParams.toString()

    return `https://click.google-analytics.com/${arg.method}?${queryString}`
  }, [arg])
}

export default useGenerateURL
