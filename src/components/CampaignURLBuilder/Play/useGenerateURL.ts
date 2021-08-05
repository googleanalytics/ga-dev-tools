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
    if (arg.adNetwork.networkID) {
      encodedParamsString.append("anid", arg.adNetwork.networkID)
    }
    if (arg.adNetwork.clickID) {
      encodedParamsString.append("aclid", arg.adNetwork.clickID)
    }
    if (arg.adNetwork.customFields) {
      arg.adNetwork.customFields.forEach(customField => {
        if (customField.builders?.includes("play")) {
          const { name, value } = customField
          encodedParamsString.append(name, value)
        }
      })
    }

    urlParams.append("referrer", encodedParamsString.toString())

    const queryString = urlParams
      .toString()
      // Replace all special macro-values with a non uriEncoded value.
      .replace("aclid%3D%257Bclick_id%257D", "aclid%3D{click_id}")
      .replace("aclid%3D%255Btransaction_id%255D", "aclid%3D[transaction_id]")
      .replace("aclid%3D%257B%257BNENDID%257D%257D", "aclid%3D{{NENDID}}")
      .replace("aclid%3D%255BCLICKID%255D", "aclid%3D[CLICKID]")
      .replace("aclid%3D%255B%253A_jv_urid%253A%255D", "aclid%3D[:_jv_urid:]")
      .replace("aclid%3D%255BCLK_ID%255D", "aclid%3D[CLK_ID]")
      .replace("aclid%3D%257Bhash%257D", "aclid%3D{hash}")
      .replace("aclid%3D%2524IMP_ID", "aclid%3D$IMP_ID")
      .replace("cp1%3D%257Bapp_id%257D", "cp1%3D{app_id}")
      .replace("cp1%3D%255BTRACK_ID%255D", "cp1%3D[TRACK_ID]")

    return `https://play.google.com/store/apps/details?${queryString}`
  }, [arg])
}

export default useGenerateUrl
