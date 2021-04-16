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
import { withProviders } from "../../test-utils"

import Layout from "../layout"

describe("Layout", () => {
  it("renders correctly", async () => {
    const { findByText } = renderer.render(
      withProviders(
        <Layout title="Page Title" pathname={"/"}>
          Content
        </Layout>
      ).wrapped
    )
    const content = await findByText("Content")
    expect(content).toBeVisible()
  })
})
