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
import { withProviders, testGapi } from "../../test-utils"
import "@testing-library/jest-dom"

import AccountExplorer from "./index"

describe("AccountExplorer", () => {
  it("renders without error for an unauthorized user", async () => {
    const { wrapped, store } = withProviders(<AccountExplorer />)
    store.dispatch({ type: "setUser", user: undefined })
    const { findByTestId } = renderer.render(wrapped)
    const result = await findByTestId("components/ViewTable/no-results")
    expect(result).toBeVisible()
  })
  describe("with an authorized user", () => {
    const user = { getId: () => "userId" }
    describe("with accounts", () => {
      it("selects the first account & shows it in the tree", async () => {
        const gapi = testGapi()
        const { wrapped, store } = withProviders(<AccountExplorer />)
        store.dispatch({ type: "setUser", user })
        store.dispatch({ type: "setGapi", gapi })
        const { findByText } = renderer.render(wrapped)
        await renderer.act(async () => {
          await gapi.client.analytics.management.accountSummaries.list()
        })
        const viewColumn = await findByText("View Name 1 1 1")
        expect(viewColumn).toBeVisible()
      })
      it("picking a view updates the table", async () => {
        const gapi = testGapi()
        const { wrapped, store } = withProviders(<AccountExplorer />)
        store.dispatch({ type: "setUser", user })
        store.dispatch({ type: "setGapi", gapi })

        const { findByText, findByLabelText } = renderer.render(wrapped)
        await renderer.act(async () => {
          await gapi.client.analytics.management.accountSummaries.list()
        })
        await renderer.act(async () => {
          // Choose the second view in the list
          const viewSelect = await findByLabelText("view")
          renderer.fireEvent.keyDown(viewSelect, { key: "ArrowDown" })
          renderer.fireEvent.keyDown(viewSelect, { key: "Return" })
        })

        const viewColumn = await findByText("View Name 1 1 2")
        expect(viewColumn).toBeVisible()
      })
      it("searching for a view updates the table", async () => {
        const gapi = testGapi()
        const { wrapped, store } = withProviders(<AccountExplorer />)
        store.dispatch({ type: "setUser", user })
        store.dispatch({ type: "setGapi", gapi })

        const { findByText, findByPlaceholderText } = renderer.render(wrapped)
        await renderer.act(async () => {
          await gapi.client.analytics.management.accountSummaries.list()
        })
        await renderer.act(async () => {
          // Choose the second view in the list
          const searchForView = await findByPlaceholderText(
            "Start typing to search..."
          )
          renderer.fireEvent.change(searchForView, {
            target: { value: "View Name 2 1 1" },
          })
        })

        const idColumn = await findByText("ga:view-id-2-1-1")
        expect(idColumn).toBeVisible()
      })
    })
  })
})
