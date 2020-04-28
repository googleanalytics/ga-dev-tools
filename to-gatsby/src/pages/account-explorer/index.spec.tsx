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
// TODO - move this into a test set-up file.
import "@testing-library/jest-dom"

import { AccountExplorer } from "./index"
import { AccountSummary } from "../../api"

describe("AccountExplorer", () => {
  it("renders without error for an unauthorized user", async () => {
    const { wrapped, store } = withProviders(<AccountExplorer />)
    store.dispatch({ type: "setUser", user: undefined })
    const { findByTestId } = renderer.render(wrapped)
    const result = await findByTestId("components/ViewTable/no-results")
    expect(result).toBeVisible()
  })
  describe("with an authorized user", () => {
    describe("with accounts", () => {
      it("selects the first account & shows it in the tree", async () => {
        const items: AccountSummary[] = [
          {
            id: "account-id",
            name: "Account Name",
            kind: "",
            webProperties: [
              {
                id: "property-id",
                name: "Property Name",
                profiles: [{ id: "view-id", name: "View Name" }],
              },
            ],
          },
        ]
        const listPromise = Promise.resolve({ result: { items } })
        const gapi = {
          client: {
            analytics: {
              management: { accountSummaries: { list: () => listPromise } },
            },
          },
        }

        const { wrapped, store } = withProviders(<AccountExplorer />)
        store.dispatch({ type: "setUser", user: {} })
        store.dispatch({ type: "setGapi", gapi })
        const { findByText } = renderer.render(wrapped)
        await renderer.act(async () => {
          // Act like the user waiting on the data to be returned.
          await listPromise
        })
        const viewColumn = await findByText("View Name")
        expect(viewColumn).toBeVisible()
      })
    })
  })
})
