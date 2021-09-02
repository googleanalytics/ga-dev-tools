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
import { StorageKey } from "@/constants"
import useAccountProperty from "./useAccountProperty"

enum QueryParam {
  Account = "a",
  Property = "b",
  Stream = "c",
}

describe("StreamPicker", () => {
  const DefaultPicker: React.FC = () => {
    const ap = useAccountProperty("a" as StorageKey, QueryParam)
    return <Sut {...ap} />
  }
  test("renders without error", async () => {
    const { wrapped } = withProviders(<DefaultPicker />)
    const { findByLabelText } = renderer.render(wrapped)

    const account = await findByLabelText(Label.Account)
    expect(account).toBeVisible()

    const property = await findByLabelText(Label.Property)
    expect(property).toBeVisible()
  })
})
