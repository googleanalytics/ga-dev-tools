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
import "@testing-library/jest-dom"

import { withProviders } from "@/test-utils"
import Sut, { Label } from "./index"
import { act, within } from "@testing-library/react"
import { AccountSummary, PropertySummary } from "@/types/ga4/StreamPicker"

describe("Event Builder", () => {
  describe("with defaults", () => {
    test("of { account } selects default", async () => {
      const account: AccountSummary = {
        name: "accountSummaries/def",
        account: "accounts/def456",
        displayName: "my second account",
      }
      const { gapi, wrapped } = withProviders(<Sut account={account} />)
      const { findByTestId } = renderer.render(wrapped)

      await act(async () => {
        await gapi.client.analyticsadmin.accountSummaries.list({})
        await gapi.client.analyticsadmin.accountSummaries.list({
          pageToken: "1",
        })
      })

      const accountPicker = await findByTestId(Label.Account)
      const accountInput = within(accountPicker).getByRole("textbox")

      expect(accountInput).toHaveValue("my second account")
    })

    test("of { account, property } selects default", async () => {
      const account: AccountSummary = {
        name: "accountSummaries/def",
        account: "accounts/def456",
        displayName: "my second account",
      }
      const property: PropertySummary = {
        displayName: "my fourth property",
        property: "properties/4",
      }
      const { gapi, wrapped } = withProviders(
        <Sut account={account} property={property} />
      )
      const { findByTestId } = renderer.render(wrapped)

      await act(async () => {
        await gapi.client.analyticsadmin.accountSummaries.list({})
        await gapi.client.analyticsadmin.accountSummaries.list({
          pageToken: "1",
        })
        // await gapi.client.analyticsadmin.properties.webDataStreams.list({})
        // await gapi.client.analyticsadmin.properties.iosAppDataStreams.list()
        // await gapi.client.analyticsadmin.properties.androidAppDataStreams.list()
      })

      const accountPicker = await findByTestId(Label.Account)
      const accountInput = within(accountPicker).getByRole("textbox")

      expect(accountInput).toHaveValue("my second account")
    })
  })
})
