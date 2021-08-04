import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import useGeneratedURL from "./useGenerateURL"
import { supportedAdNetworks } from "../adNetworks"

describe("useGenerateURL hook", () => {
  test("all fields provided for a redirect-based network", () => {
    const arg = {
      adNetwork: supportedAdNetworks[0],
      method: supportedAdNetworks[0].method,
      appID: "appID",
      source: "source",
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
      propertyID: "UA-ABC-DE",
      redirectURL: "https://redirect.com/",
      deviceID: "deviceID",
      customFields: undefined,
    }
    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://click.google-analytics.com/redirect?tid=UA-ABC-DE&url=https%3A%2F%2Fredirect.com%2F&aid=appID&idfa=deviceID&cs=source&cm=medium&cn=name&cc=content&ck=term&anid=aarki&aclid=%7Bclick_id%7D"
    )
  })
})
