// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as sut from "./_params"

describe("for campaign url builder param parsing", () => {
  describe("a url with", () => {
    describe("unknown params", () => {
      test("in search stays in cleaned url", () => {
        const url = "https://example.com?abc=def"

        const {
          campaignParams: actual,
          cleanedWebsiteUrl,
        } = sut.extractParamsFromWebsiteUrl(url)

        expect(Object.values(actual)).toHaveLength(0)
        expect(cleanedWebsiteUrl).toBe("https://example.com?abc=def")
      })

      test("in fragment stays in cleaned url", () => {
        const url = "https://example.com#abc=def"

        const {
          campaignParams: actual,
          cleanedWebsiteUrl,
        } = sut.extractParamsFromWebsiteUrl(url)

        expect(Object.values(actual)).toHaveLength(0)
        expect(cleanedWebsiteUrl).toBe("https://example.com#abc=def")
      })

      test("in [search -> fragment] stays in cleaned url", () => {
        const url = "https://example.com?abc=def#ghi=jkl"

        const {
          campaignParams: actual,
          cleanedWebsiteUrl,
        } = sut.extractParamsFromWebsiteUrl(url)

        expect(Object.values(actual)).toHaveLength(0)
        expect(cleanedWebsiteUrl).toBe("https://example.com?abc=def#ghi=jkl")
      })
      test("in [fragment -> search] stays in cleaned url", () => {
        const url = "https://example.com#ghi=jkl?abc=def"

        const {
          campaignParams: actual,
          cleanedWebsiteUrl,
        } = sut.extractParamsFromWebsiteUrl(url)

        expect(Object.values(actual)).toHaveLength(0)
        expect(cleanedWebsiteUrl).toBe("https://example.com#ghi=jkl?abc=def")
      })
    })
    test("no ending slash stays that way", () => {
      const url = "https://example.com"
      const { cleanedWebsiteUrl } = sut.extractParamsFromWebsiteUrl(url)
      expect(cleanedWebsiteUrl).toBe(url)
    })

    test("an ending slash stays that way", () => {
      const url = "https://example.com/"
      const { cleanedWebsiteUrl } = sut.extractParamsFromWebsiteUrl(url)
      expect(cleanedWebsiteUrl).toBe(url)
    })
    test("all parameters (query params) can be parsed correctly", () => {
      const url =
        "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=running+shoes&utm_content=logolink"

      const {
        campaignParams: actual,
        cleanedWebsiteUrl,
      } = sut.extractParamsFromWebsiteUrl(url)

      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
      expect(actual.utm_campaign).toBe("spring_sale")
      expect(actual.utm_term).toBe("running shoes")
      expect(actual.utm_content).toBe("logolink")

      expect(cleanedWebsiteUrl).toBe("https://example.com")
    })

    test("all parameters (fragment) can be parsed correctly", () => {
      const url =
        "https://example.com#utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=running+shoes&utm_content=logolink"

      const {
        campaignParams: actual,
        cleanedWebsiteUrl,
      } = sut.extractParamsFromWebsiteUrl(url)

      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
      expect(actual.utm_campaign).toBe("spring_sale")
      expect(actual.utm_term).toBe("running shoes")
      expect(actual.utm_content).toBe("logolink")
      expect(cleanedWebsiteUrl).toBe("https://example.com")
    })

    test("only one parameter can be parsed correctly", () => {
      const url = "https://example.com?utm_source=google"

      const {
        campaignParams: actual,
        cleanedWebsiteUrl,
      } = sut.extractParamsFromWebsiteUrl(url)

      expect(actual.utm_source).toBe("google")
      expect(cleanedWebsiteUrl).toBe("https://example.com")
    })

    test("[fragment] can be parsed correctly", () => {
      const url = "https://example.com#utm_medium=cpc"

      const {
        campaignParams: actual,
        cleanedWebsiteUrl,
      } = sut.extractParamsFromWebsiteUrl(url)

      expect(actual.utm_medium).toBe("cpc")
      expect(cleanedWebsiteUrl).toBe("https://example.com")
    })

    test("[search params -> fragment] can be parsed correctly", () => {
      const url = "https://example.com?utm_source=google#utm_medium=cpc"

      const {
        campaignParams: actual,
        cleanedWebsiteUrl,
      } = sut.extractParamsFromWebsiteUrl(url)

      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
      expect(cleanedWebsiteUrl).toBe("https://example.com")
    })

    test("[fragment -> search params] can be parsed correctly", () => {
      const url = "https://example.com#utm_medium=cpc?utm_source=google"

      const {
        campaignParams: actual,
        cleanedWebsiteUrl,
      } = sut.extractParamsFromWebsiteUrl(url)

      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
      expect(cleanedWebsiteUrl).toBe("https://example.com")
    })
  })
})
