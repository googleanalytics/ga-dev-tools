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

import * as React from "react"
import * as renderer from "@testing-library/react"
import { withProviders } from "../../test-utils"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import { CampaignURLBuilder, URLBuilderType } from "./index"
import { GAVersion } from "../../constants"

// Capture original error global so it's easier to replace after a mock.
const originalError = console.error
describe("for the Campaign URL Builder component", () => {
  beforeEach(() => {
    process.env.BITLY_CLIENT_ID = "bitly-client-id"
    console.error = originalError
  })

  test("can render page without error", () => {
    const { wrapped } = withProviders(
      <CampaignURLBuilder
        version={GAVersion.UniversalAnalytics}
        type={URLBuilderType.Web}
      />
    )
    renderer.render(wrapped)
  })
  test("generates url for happy path inputs", async () => {
    const { wrapped } = withProviders(
      <CampaignURLBuilder
        version={GAVersion.UniversalAnalytics}
        type={URLBuilderType.Web}
      />
    )
    const { findByLabelText: find } = renderer.render(wrapped)
    // Enter happy path values
    await userEvent.type(await find(/website URL/), "https://example.com")
    await userEvent.type(await find(/campaign ID/), "abc.def")
    await userEvent.type(await find(/campaign source/), "google")
    await userEvent.type(await find(/campaign medium/), "cpc")
    await userEvent.type(await find(/campaign name/), "spring_sale")
    await userEvent.type(await find(/campaign term/), "running+shoes")
    await userEvent.type(await find(/campaign content/), "logolink")

    const input = await find(/generated URL/)

    expect(input).toHaveValue(
      "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_id=abc.def&utm_term=running%2Bshoes&utm_content=logolink"
    )
  })
  describe("entering a website url with existing", () => {
    test("fills all when provided", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find } = renderer.render(wrapped)
      renderer.fireEvent.change(await find(/website URL/), {
        target: {
          value:
            "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_id=abc.def&utm_term=running%2Bshoes&utm_content=logolink",
        },
      })

      expect(await find(/campaign ID/)).toHaveValue("abc.def")
      expect(await find(/campaign source/)).toHaveValue("google")
      expect(await find(/campaign medium/)).toHaveValue("cpc")
      expect(await find(/campaign name/)).toHaveValue("spring_sale")
      expect(await find(/campaign term/)).toHaveValue("running+shoes")
      expect(await find(/campaign content/)).toHaveValue("logolink")
    })
  })
  describe("entering a no-no url shows a warning", () => {
    test("url: ga-dev-tools.web.app", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(
        await find(/website URL/),
        "https://ga-dev-tools.web.app"
      )

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
    test("url: play.google.com", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(await find(/website URL/), "https://play.google.com")

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
    test("url: itunes.apple.com", async () => {
      const { wrapped } = withProviders(
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Web}
        />
      )
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(
        await find(/website URL/),
        "https://itunes.apple.com"
      )

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
  })

  // describe("when shortening URLs", () => {
  //   const setUpValidURL = async (find: any) => {
  //     await userEvent.type(await find(/website URL/), "https://example.com")
  //     await userEvent.type(await find(/campaign source/), "google")
  //     await userEvent.type(await find(/campaign medium/), "cpc")
  //     await userEvent.type(await find(/campaign name/), "spring_sale")
  //     await userEvent.type(await find(/campaign term/), "running+shoes")
  //     await userEvent.type(await find(/campaign content/), "logolink")
  //   }

  //   test("Shorten link button doesn't appear when BITLY_CLIENT_ID is undefined.", async () => {
  //     console.error = jest.fn()
  //     delete process.env.BITLY_CLIENT_ID

  //     const { wrapped } = withProviders(<CampaignURLBuilder />)
  //     const { findByLabelText, findByTestId } = renderer.render(wrapped)

  //     await setUpValidURL(findByLabelText)

  //     await expect(
  //       async () => await findByTestId("shorten-button")
  //     ).rejects.toThrow(
  //       `Unable to find an element by: [data-testid="shorten-button"]`
  //     )
  //   })

  //   test("Shorten link button appears when BITLY_CLIENT_ID is set", async () => {
  //     process.env.BITLY_CLIENT_ID = "Explicitly setting value for test"

  //     const { wrapped } = withProviders(<CampaignURLBuilder />)
  //     const { findByLabelText, findByTestId } = renderer.render(wrapped)

  //     await setUpValidURL(findByLabelText)

  //     expect(await findByTestId("shorten-button")).toBeVisible()
  //   })

  //   test("shorten button when accessToken not in localStorage", async () => {
  //     window.localStorage.removeItem(StorageKey.bitlyAccessToken)
  //     process.env.BITLY_CLIENT_ID = "Explicitly setting value for test"

  //     const { wrapped } = withProviders(<CampaignURLBuilder />)
  //     const { findByLabelText, findByTestId } = renderer.render(wrapped)

  //     await setUpValidURL(findByLabelText)

  //     expect(await findByTestId("shorten-button")).toHaveTextContent(
  //       "Shorten URL"
  //     )
  //   })

  //   describe("with mocked fetch", () => {
  //     const SHORT_LINK = "shortened link response"
  //     const originalFetch = window.fetch
  //     beforeEach(() => {
  //       process.env.BITLY_CLIENT_ID = "Explicitly setting value for test"
  //       ;(window.fetch as any) = jest.fn(() => ({
  //         json: async (): Promise<ShortenResponse> => ({
  //           link: SHORT_LINK,
  //         }),
  //       }))
  //     })

  //     afterEach(() => {
  //       window.fetch = originalFetch
  //     })

  //     test("Successfull auth flow sets shortens link", async () => {
  //       ;(window.open as any) = jest.fn()
  //       let sendStorageEvent:
  //         | ((e: Pick<StorageEvent, "key" | "newValue">) => void)
  //         | undefined
  //       const originalAdd = window.addEventListener
  //       window.addEventListener = jest.fn((t, cb: any) => {
  //         if (t === "storage") {
  //           sendStorageEvent = cb
  //         } else {
  //           originalAdd(t, cb)
  //         }
  //       })

  //       const { wrapped } = withProviders(<CampaignURLBuilder />)
  //       const { findByLabelText, findByTestId } = renderer.render(wrapped)

  //       await renderer.act(async () => {
  //         await setUpValidURL(findByLabelText)
  //         ;(await findByTestId("shorten-button")).click()
  //         expect(sendStorageEvent).toBeDefined()
  //         sendStorageEvent!({
  //           key: StorageKey.bitlyAccessToken,
  //           newValue: "acessToken",
  //         })
  //       })

  //       expect(await findByTestId("shorten-button")).not.toHaveTextContent(
  //         "authorization required"
  //       )

  //       expect(await findByLabelText(/generated URL/)).toHaveValue(SHORT_LINK)
  //     })

  //     test("with accessToken in localStorage skips auth", async () => {
  //       ;(window.open as any) = jest.fn(() => {
  //         fail("window.open should not be call if auth was skipped")
  //       })
  //       window.localStorage.setItem(StorageKey.bitlyAccessToken, "accessToken!")

  //       const { wrapped } = withProviders(<CampaignURLBuilder />)
  //       const { findByLabelText, findByTestId } = renderer.render(wrapped)

  //       await renderer.act(async () => {
  //         await setUpValidURL(findByLabelText)
  //         ;(await findByTestId("shorten-button")).click()
  //       })

  //       expect(await findByLabelText(/generated URL/)).toHaveValue(SHORT_LINK)
  //     })
  //   })
  // })
})
