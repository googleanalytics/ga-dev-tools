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
import { withProviders } from "../test-utils"

import Layout from "./layout"
import { usePageView } from "../hooks"

describe("Layout", () => {
  it("renders correctly", async () => {
    const { findByText } = renderer.render(
      withProviders(<Layout title="Page Title">Content</Layout>).wrapped
    )
    const content = await findByText("Content")
    expect(content).toBeVisible()
  })
})

// TODO - move this to hooks.spec.ts
describe("usePageView hook", () => {
  const TestComponent: React.FC = () => {
    usePageView()
    return <>Hi</>
  }

  describe("when gtag is undefined", () => {
    test("and stays that does nothing", () => {
      const { wrapped, store } = withProviders(<TestComponent />)
      store.dispatch({ type: "setGtag", gtag: undefined })
      renderer.render(wrapped)
    })
    test("but is defined later makes a pageView", () => {
      const gtag = jest.fn()
      const pathOverride = "/hello"
      const { wrapped, store } = withProviders(<TestComponent />, {
        path: pathOverride,
        measurementID: "abc",
      })

      renderer.render(wrapped)
      renderer.act(() => {
        store.dispatch({ type: "setGtag", gtag: gtag })
      })

      const gtagCalls = gtag.mock.calls
      expect(gtagCalls).toHaveLength(1)
      expect(gtagCalls[0]).toEqual([
        "config",
        "abc",
        { page_path: pathOverride },
      ])
    })
  })
  describe("when gtag is defined", () => {
    test("and user navigates to page", async () => {
      const path1 = "/hello"
      const path2 = "/second"
      const gtag = jest.fn()
      const { wrapped, store, history } = withProviders(<TestComponent />, {
        path: path1,
        measurementID: "abc",
      })
      store.dispatch({ type: "setGtag", gtag: gtag })
      renderer.render(wrapped)
      await renderer.act(async () => {
        // Navigate to another page
        await history.navigate(path2)
      })
      const gtagCalls = gtag.mock.calls
      expect(gtagCalls).toHaveLength(2)
      expect(gtagCalls[0]).toEqual(["config", "abc", { page_path: path1 }])
      expect(gtagCalls[1]).toEqual(["config", "abc", { page_path: path2 }])
    })
  })
})
