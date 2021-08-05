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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={advertising_id}&cs=aarki&cm=medium&cn=name&cc=content&ck=term&anid=aarki&aclid={click_id}&cp1={app_id}"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    // populate the itunes store id value
    arg.customFields![0].value = "id123456789"
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=[IDFA]&cs=adcolony&cm=medium&cn=name&cc=content&ck=term&anid=adcolony&asid=id123456789"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={idfa}&cs=google&cm=medium&cn=name&cc=content&ck=term&anid=admob&hash=md5"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={ADID}&cs=applovin&cm=medium&cn=name&cc=content&ck=term&anid=applovin"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={idfa}&cs=conversant&cm=medium&cn=name&cc=content&ck=term&anid=conversant"
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
      propertyID: "UA-41425441-2",
      redirectURL: "",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    // populate the itunes store id value
    arg.customFields![0].value = "id123456789"
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/ping?tid=UA-41425441-2&aid=app_id&idfa={{advertising_id}}&cs=fiksu&cm=medium&cn=name&cc=content&ck=term&anid=fiksu&asid=id123456789"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=$IDA&cs=inmobi&cm=medium&cn=name&cc=content&ck=term&anid=inmobi&aclid=$IMP_ID"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={apple_ifa}&cs=jampp&cm=medium&cn=name&cc=content&ck=term&anid=jampp&aclid={hash}"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=[DEVICE_AD_ID]&cs=leadbolt&cm=medium&cn=name&cc=content&ck=term&anid=leadbolt&aclid=[CLK_ID]&cp1=[TRACK_ID]"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=--IDFA--&cs=limei&cm=medium&cn=name&cc=content&ck=term&anid=limei&aclid=--LIMEIBIDID--"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=[:_jv_uaid:]&cs=millennial&cm=medium&cn=name&cc=content&ck=term&anid=millennial&aclid=[:_jv_urid:]"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=JT_IDFA&cs=millennialdsp&cm=medium&cn=name&cc=content&ck=term&anid=millennialdsp&aclid=JT_REQID"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    // populate the itunes store id value
    arg.customFields![0].value = "id123456789"
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=[AID]&cs=mdotm&cm=medium&cn=name&cc=content&ck=term&anid=mdotm&aclid=[CLICKID]&asid=id123456789"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=MFOXIFA&cs=mobfox&cm=medium&cn=name&cc=content&ck=term&anid=mobfox"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={{IDFA}}&cs=nend&cm=medium&cn=name&cc=content&ck=term&anid=nend&aclid={{NENDID}}"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=xxxidfaxxx&cs=opera&cm=medium&cn=name&cc=content&ck=term&anid=opera&aclid=xxxtransidxxx"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=[idfa]&cs=phunware&cm=medium&cn=name&cc=content&ck=term&anid=phunware&aclid=[transaction_id]"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=[idfa]&cs=snakkads&cm=medium&cn=name&cc=content&ck=term&anid=snakkads&aclid=[transaction_id]"
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: network.deviceID,
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa=TAPJOY_RESTORED_RAW_ADVERTISING_ID&cs=tapjoy&cm=medium&cn=name&cc=content&ck=term&anid=tapjoy"
    )
  })

  test("Custom network redirect", () => {
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
      propertyID: "UA-41425441-2",
      redirectURL: "https://itunes.apple.com/us/app/my-app/id123456789",
      deviceID: "{idfa}",
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-41425441-2&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fmy-app%2Fid123456789&aid=app_id&idfa={idfa}&cs=source&cm=medium&cn=name&cc=content&ck=term"
    )
  })

  test("Custom network ping", () => {
    const network = supportedAdNetworks[19]
    const arg = {
      adNetwork: network,
      method: "ping",
      appID: "app_id",
      source: "source",
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "UA-41425441-2",
      redirectURL: "",
      deviceID: "{idfa}",
      customFields: network.customFields,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/ping?tid=UA-41425441-2&aid=app_id&idfa={idfa}&cs=source&cm=medium&cn=name&cc=content&ck=term"
    )
  })
})
