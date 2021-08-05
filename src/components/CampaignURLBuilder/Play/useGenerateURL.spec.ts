import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import useGeneratedURL from "./useGenerateURL"
import { supportedAdNetworks } from "../adNetworks"

describe("useGenerateURL hook", () => {
  test("Aarki network", () => {
    const network = supportedAdNetworks[0]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Daarki%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Daarki%26aclid%3D{click_id}%26cp1%3D{app_id}"
    )
  })

  test("AdColony network", () => {
    const network = supportedAdNetworks[1]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dadcolony%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dadcolony"
    )
  })

  test("Google AdMob network", () => {
    const network = supportedAdNetworks[2]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dgoogle%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dadmob"
    )
  })

  test("Applovin network", () => {
    const network = supportedAdNetworks[3]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dapplovin%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dapplovin"
    )
  })

  test("Conversant network", () => {
    const network = supportedAdNetworks[4]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dconversant%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dconversant"
    )
  })

  test("Fiksu network", () => {
    const network = supportedAdNetworks[5]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    // populate the itunes store id value
    arg.customFields![0].value = "id123456789"
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dfiksu%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dfiksu"
    )
  })

  test("InMobi network", () => {
    const network = supportedAdNetworks[6]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dinmobi%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dinmobi%26aclid%3D$IMP_ID"
    )
  })

  test("Jampp network", () => {
    const network = supportedAdNetworks[7]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Djampp%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Djampp%26aclid%3D{hash}"
    )
  })

  test("Leadbolt network", () => {
    const network = supportedAdNetworks[8]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dleadbolt%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dleadbolt%26aclid%3D[CLK_ID]%26cp1%3D[TRACK_ID]"
    )
  })

  test("Limei network", () => {
    const network = supportedAdNetworks[9]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dlimei%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dlimei%26aclid%3D--LIMEIBIDID--"
    )
  })

  test("Millenial Media network", () => {
    const network = supportedAdNetworks[10]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dmillennial%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dmillennial%26aclid%3D[:_jv_urid:]"
    )
  })

  test("Millenial Media DSP network", () => {
    const network = supportedAdNetworks[11]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dmillennialdsp%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dmillennialdsp%26aclid%3DJT_REQID"
    )
  })

  test("MdotM network", () => {
    const network = supportedAdNetworks[12]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    // populate the itunes store id value
    arg.customFields![0].value = "id123456789"
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dmdotm%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dmdotm%26aclid%3D[CLICKID]"
    )
  })

  test("MobFox network", () => {
    const network = supportedAdNetworks[13]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dmobfox%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dmobfox"
    )
  })

  test("nend network", () => {
    const network = supportedAdNetworks[14]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dnend%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dnend%26aclid%3D{{NENDID}}"
    )
  })

  test("Opera network", () => {
    const network = supportedAdNetworks[15]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dopera%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dopera%26aclid%3Dxxxtransidxxx"
    )
  })

  test("Phunware network", () => {
    const network = supportedAdNetworks[16]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dphunware%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dphunware%26aclid%3D[transaction_id]"
    )
  })

  test("Snakk!Ads network", () => {
    const network = supportedAdNetworks[17]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dsnakkads%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dsnakkads%26aclid%3D[transaction_id]"
    )
  })

  test("Tapjoy network", () => {
    const network = supportedAdNetworks[18]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: network.source || network.networkID,
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dtapjoy%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Dtapjoy"
    )
  })

  test("Custom network", () => {
    const network = supportedAdNetworks[19]
    const arg = {
      adNetwork: network,
      method: network.method,
      appID: "app_id",
      source: "source",
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "",
      redirectURL: "",
      deviceID: "{idfa}",
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=app_id&referrer=utm_source%3Dsource%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname"
    )
  })
})
