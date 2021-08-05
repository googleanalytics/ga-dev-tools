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

    if (arg.adNetwork.networkID) {
      urlParams.append("anid", arg.adNetwork.networkID)
    }
    if (arg.adNetwork.clickID) {
      urlParams.append("aclid", arg.adNetwork.clickID)
    }

    // if (arg.adNetwork.customFields) {
    //   arg.adNetwork.customFields.forEach(customField => {
    //     if (customField.builders?.includes("play")) {
    //       const { name, value } = customField
    //       encodedParamsString.append(name, value)
    //     }
    //   })
    // }

    if (arg.customFields) {
      arg.customFields.forEach(customField => {
        if (customField.builders?.includes("ios")) {
          const { name, value } = customField
          urlParams.append(name, value)
        }
      })
    }

    if (arg.adNetwork.label === "Google AdMob") {
      urlParams.append("hash", "md5")
    }

    const queryString = urlParams
      .toString()
      // Replace all special macro-values with a non uriEncoded value.
      .replace("idfa=%7Badvertising_id%7D", "idfa={advertising_id}")
      .replace("idfa=%5BIDFA%5D", "idfa=[IDFA]")
      .replace("idfa=%7Bidfa%7D", "idfa={idfa}")
      .replace("idfa=%7BADID%7D", "idfa={ADID}")
      .replace("idfa=%7B%7Badvertising_id%7D%7D", "idfa={{advertising_id}}")
      .replace("idfa=%24IDA", "idfa=$IDA")
      .replace("idfa=%7Bapple_ifa%7D", "idfa={apple_ifa}")
      .replace("idfa=%5BDEVICE_AD_ID%5D", "idfa=[DEVICE_AD_ID]")
      .replace("idfa=%5B%3A_jv_uaid%3A%5D", "idfa=[:_jv_uaid:]")
      .replace("idfa=%5BAID%5D", "idfa=[AID]")
      .replace("idfa=%7B%7BIDFA%7D%7D", "idfa={{IDFA}}")
      .replace("idfa=%5Bidfa%5D", "idfa=[idfa]")
      .replace("aclid=%7Bclick_id%7D", "aclid={click_id}")
      .replace("aclid=%24IMP_ID", "aclid=$IMP_ID")
      .replace("aclid=%7Bhash%7D", "aclid={hash}")
      .replace("aclid=%5BCLK_ID%5D", "aclid=[CLK_ID]")
      .replace("aclid=%5B%3A_jv_urid%3A%5D", "aclid=[:_jv_urid:]")
      .replace("aclid=%5BCLICKID%5D", "aclid=[CLICKID]")
      .replace("aclid=%7B%7BNENDID%7D%7D", "aclid={{NENDID}}")
      .replace("aclid=%5Btransaction_id%5D", "aclid=[transaction_id]")
      .replace("cp1=%7Bapp_id%7D", "cp1={app_id}")
      .replace("cp1=%5BTRACK_ID%5D", "cp1=[TRACK_ID]")

    return `https://click.google-analytics.com/${arg.method}?${queryString}`
  }, [arg])
}

export default useGenerateURL
