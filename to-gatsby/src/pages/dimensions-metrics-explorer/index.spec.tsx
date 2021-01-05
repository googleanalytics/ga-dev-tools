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

import { DimensionsAndMetricsExplorer } from "./index"

describe("Dimensions and Metrics Explorer", () => {
  it("renders without error", async () => {
    const { wrapped, store } = withProviders(<DimensionsAndMetricsExplorer />)
    store.dispatch({ type: "setUser", user: undefined })
    const { container } = renderer.render(wrapped)
    // Add timeout since cubes are "fetched"
    await renderer.waitFor(() => {}, { timeout: 1000 })
    expect(container).toHaveTextContent("Metrics Explorer lists")
  })
})
