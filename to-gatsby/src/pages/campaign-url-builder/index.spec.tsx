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
import { CampaignUrlBuilder } from "./index"

describe("for the Campaign URL Builder component", () => {
  test("can render page without error", () => {
    const { wrapped } = withProviders(<CampaignUrlBuilder />)
    renderer.render(wrapped)
  })
  test("generates url for happy path inputs", async () => {
    const { wrapped } = withProviders(<CampaignUrlBuilder />)
    const { findByLabelText: find } = renderer.render(wrapped)
    // Enter happy path values
    await userEvent.type(await find(/Website URL/), "https://example.com")
    await userEvent.type(await find(/Campaign Source/), "google")
    await userEvent.type(await find(/Campaign Medium/), "cpc")
    await userEvent.type(await find(/Campaign Name/), "spring_sale")
    await userEvent.type(await find(/Campaign Term/), "running+shoes")
    await userEvent.type(await find(/Campaign Content/), "logolink")

    const input = await find(/Generated URL/)

    expect(input).toHaveValue(
      "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=running%2Bshoes&utm_content=logolink"
    )
  })
  describe("entering a website url with existing", () => {
    test("fills all when provided", async () => {
      const { wrapped } = withProviders(<CampaignUrlBuilder />)
      const { findByLabelText: find } = renderer.render(wrapped)
      renderer.fireEvent.change(await find(/Website URL/), {
        target: {
          value:
            "https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=term&utm_content=content",
        },
      })

      expect(await find(/Campaign Source/)).toHaveValue("google")
      expect(await find(/Campaign Medium/)).toHaveValue("cpc")
      expect(await find(/Campaign Name/)).toHaveValue("spring_sale")
      expect(await find(/Campaign Term/)).toHaveValue("term")
      expect(await find(/Campaign Content/)).toHaveValue("content")
    })
  })
  describe("entering a no-no url shows a warning", () => {
    test("url: ga-dev-tools.appspot.com", async () => {
      const { wrapped } = withProviders(<CampaignUrlBuilder />)
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(
        await find(/Website URL/),
        "https://ga-dev-tools.appspot.com"
      )

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
    test("url: play.google.com", async () => {
      const { wrapped } = withProviders(<CampaignUrlBuilder />)
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(await find(/Website URL/), "https://play.google.com")

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
    test("url: itunes.apple.com", async () => {
      const { wrapped } = withProviders(<CampaignUrlBuilder />)
      const { findByLabelText: find, findByTestId } = renderer.render(wrapped)
      await userEvent.type(
        await find(/Website URL/),
        "https://itunes.apple.com"
      )

      const warningBanner = await findByTestId("bad-url-warnings")

      expect(warningBanner).toBeVisible()
    })
  })
})
