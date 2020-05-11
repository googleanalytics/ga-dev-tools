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

import { HitBuilder } from "./index"

describe("HitBuilder", () => {
  // Does right thing when unauthed

  // Does right thing when authed (happy path render)

  describe("updates the hit payload", () => {
    test("when t parameter is changed", () => {})
    test("when tid parameter is changed", () => {})
    test("when tcid parameter is changed", () => {})
    test("after clicking 'generate uuid'", () => {})
  })

  describe("when adding a parameter", () => {
    test("updates hit payload when changing parameter name", () => {})
    test("updates hit payload when changing parameter value", () => {})
    test("updates hit payload when removing parameter", () => {})
  })

  describe("Validate hit", () => {
    // TODO - I can't remember what this is supposed to do, exactly, so figure
    // that out before merging this in.
    // Probably makes sense to test against the title of the banner.
    test("when valid updates the ui accordingly", () => {})
    test("when invalid indicates which parameter is wrong", () => {})
  })

  // Changing the t parameter updates the hit payload

  // Changing the tid parameter updates the hit payload
})
