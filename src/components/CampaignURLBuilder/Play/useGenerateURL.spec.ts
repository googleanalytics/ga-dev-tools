import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import useGeneratedURL from "./useGenerateURL"
import { supportedAdNetworks } from "../adNetworks"

describe("useGenerateURL hook", () => {
  test("all fields provided for a redirect-based network", () => {
    const arg = {
      adNetwork: supportedAdNetworks[0],
      appID: "appID",
      source: "source",
      medium: "medium",
      term: "term",
      content: "content",
      name: "name",
    }

    const { result } = renderHook(() => useGeneratedURL(arg))
    expect(result.current).toBeDefined()
    expect(result.current).toEqual(
      "https://play.google.com/store/apps/details?id=appID&referrer=utm_source%3Dsource%26utm_medium%3Dmedium%26utm_term%3Dterm%26utm_content%3Dcontent%26utm_campaign%3Dname%26anid%3Daarki%26aclid%3D%257Bclick_id%257D%26cp1%3D%257Bapp_id%257D"
    )
  })
})
