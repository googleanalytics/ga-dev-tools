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
import * as renderer from "react-test-renderer"
import { withProviders } from "../../test-utils"

import { AccountExplorer } from "./index"

describe("AccountExplorer", () => {
  it("renders without error for an unauthorized user", () => {
    const { wrapped, store } = withProviders(<AccountExplorer />)
    store.dispatch({ type: "setUser", user: undefined })
    const tree = renderer.create(wrapped).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
