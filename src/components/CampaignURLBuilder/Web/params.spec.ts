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

import * as sut from "./params"
import { CampaignParams } from "./params"

describe("for campaign url builder param parsing", () => {
  describe("for websiteURLFor with", () => {
    test("happy path [query]", () => {
      const url = "https://example.com"
      const params: Partial<CampaignParams> = { utm_source: "google" }
      const actual = sut.websiteURLFor(url, params)

      expect(actual).toBe(`https://example.com?utm_source=google`)
    })
    test("happy path [fragment params]", () => {
      const url = "https://example.com"
      const params: Partial<CampaignParams> = { utm_source: "google" }
      const actual = sut.websiteURLFor(url, params, true)

      expect(actual).toBe(`https://example.com#utm_source=google`)
    })
    test("normal fragment is left alone", () => {
      const url = "https://example.com#abc"
      const params: Partial<CampaignParams> = { utm_source: "google" }
      const actual = sut.websiteURLFor(url, params)

      expect(actual).toBe(`https://example.com?utm_source=google#abc`)
    })

    describe("existing parameters", () => {
      describe("in fragment", () => {
        test("not ours are left alone", () => {
          const url = "https://example.com#abc=123"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params)

          expect(actual).toBe(`https://example.com?utm_source=google#abc=123`)
        })
        test("ours are moved to query", () => {
          const url = "https://example.com#utm_source=google"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params)

          expect(actual).toBe(`https://example.com?utm_source=google`)
        })
        test("ours are kept in fragment if requested", () => {
          const url = "https://example.com#utm_source=google"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params, true)

          expect(actual).toBe(`https://example.com#utm_source=google`)
        })
      })
      describe("in query", () => {
        test("not ours are left alone", () => {
          const url = "https://example.com?abc=123"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params)

          expect(actual).toBe(`https://example.com?abc=123&utm_source=google`)
        })
        test("ours are 'moved' to query", () => {
          const url = "https://example.com?utm_source=google"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params)

          expect(actual).toBe(`https://example.com?utm_source=google`)
        })
        test("ours are moved to fragment if requested", () => {
          const url = "https://example.com?utm_source=google"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params, true)

          expect(actual).toBe(`https://example.com#utm_source=google`)
        })
      })
      describe("in fragment and query", () => {
        test("not ours are left alone", () => {
          const url = "https://example.com?abc=123#def=456"
          const params: Partial<CampaignParams> = { utm_source: "google" }
          const actual = sut.websiteURLFor(url, params)

          expect(actual).toBe(
            `https://example.com?abc=123&utm_source=google#def=456`
          )
        })
        test("ours are moved to query", () => {
          const url =
            "https://example.com?utm_source=google#utm_campaign=spring_sale"
          const params: Partial<CampaignParams> = {
            utm_source: "google",
            utm_campaign: "spring_sale",
          }
          const actual = sut.websiteURLFor(url, params)

          expect(actual).toBe(
            `https://example.com?utm_source=google&utm_campaign=spring_sale`
          )
        })
      })
    })
  })
  describe("for extractParams with a url with", () => {
    describe("common errors", () => {
      test("missing protocol still works", () => {
        const url = "example.com"
        expect(sut.extractParamsFromWebsiteURL(url)).not.toBeUndefined()
      })
    })

    test("our parameters [query], but empty are ignored", () => {
      const url = "example.com?utm_source"
      const actual = sut.extractParamsFromWebsiteURL(url)!
      expect(actual.utm_source).toBeUndefined()
    })

    test("our parameters [fragment], but empty are ignored", () => {
      const url = "example.com#utm_source"
      const actual = sut.extractParamsFromWebsiteURL(url)!
      expect(actual.utm_source).toBeUndefined()
    })

    describe("unknown params", () => {
      test("in search are ignored", () => {
        const url = "https://example.com?abc=def"
        const actual = sut.extractParamsFromWebsiteURL(url)!
        expect(Object.values(actual)).toHaveLength(0)
      })
      test("in fragment are ignored", () => {
        const url = "https://example.com#abc=def"
        const actual = sut.extractParamsFromWebsiteURL(url)!
        expect(Object.values(actual)).toHaveLength(0)
      })
      test("in [search -> fragment] are ignored", () => {
        const url = "https://example.com?abc=def#ghi=jkl"
        const actual = sut.extractParamsFromWebsiteURL(url)!
        expect(Object.values(actual)).toHaveLength(0)
      })
      test("in [fragment -> search] are ignored", () => {
        const url = "https://example.com#ghi=jkl?abc=def"
        const actual = sut.extractParamsFromWebsiteURL(url)!
        expect(Object.values(actual)).toHaveLength(0)
      })
    })

    test("no ending slash doesn't throw", () => {
      const url = "https://example.com"
      expect(sut.extractParamsFromWebsiteURL(url)).not.toBeUndefined()
    })

    test("an ending slash doesn't throw", () => {
      const url = "https://example.com/"
      expect(sut.extractParamsFromWebsiteURL(url)).not.toBeUndefined()
    })
    test("all parameters (query params) can be parsed correctly", () => {
      const url =
        "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=running+shoes&utm_id=abcdef&utm_content=logolink"

      const actual = sut.extractParamsFromWebsiteURL(url)!

      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
      expect(actual.utm_campaign).toBe("spring_sale")
      expect(actual.utm_id).toBe("abcdef")
      expect(actual.utm_term).toBe("running shoes")
      expect(actual.utm_content).toBe("logolink")
    })

    test("all parameters (fragment) can be parsed correctly", () => {
      const url =
        "https://example.com#utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_id=abcdef&utm_term=running+shoes&utm_content=logolink"

      const actual = sut.extractParamsFromWebsiteURL(url)!

      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
      expect(actual.utm_campaign).toBe("spring_sale")
      expect(actual.utm_id).toBe("abcdef")
      expect(actual.utm_term).toBe("running shoes")
      expect(actual.utm_content).toBe("logolink")
    })

    test("only one parameter can be parsed correctly", () => {
      const url = "https://example.com?utm_source=google"
      const actual = sut.extractParamsFromWebsiteURL(url)!
      expect(actual.utm_source).toBe("google")
    })

    test("[fragment] can be parsed correctly", () => {
      const url = "https://example.com#utm_medium=cpc"
      const actual = sut.extractParamsFromWebsiteURL(url)!
      expect(actual.utm_medium).toBe("cpc")
    })

    test("[search params -> fragment] can be parsed correctly", () => {
      const url = "https://example.com?utm_source=google#utm_medium=cpc"
      const actual = sut.extractParamsFromWebsiteURL(url)!
      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
    })

    test("[fragment -> search params] can be parsed correctly", () => {
      const url = "https://example.com#utm_medium=cpc?utm_source=google"
      const actual = sut.extractParamsFromWebsiteURL(url)!
      expect(actual.utm_source).toBe("google")
      expect(actual.utm_medium).toBe("cpc")
    })
  })
})
