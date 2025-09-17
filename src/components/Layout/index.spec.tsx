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

import Layout from "../Layout"
import { testGapi } from "@/test-utils/gapi"

describe("Layout", () => {
  it("renders correctly with gapi undefined", async () => {
    const { wrapped, store } = withProviders(
      <Layout title="Page Title" pathname={"/"} description="my description">
        Content
      </Layout>
    )
    store.dispatch({ type: "setGapi", gapi: undefined })
    const { findByText } = renderer.render(wrapped)
    const content = await findByText("Content")
    expect(content).toBeVisible()
  })

  describe("redirect logic", () => {
    const originalLocation = window.location
    const gapi = {
      ...testGapi(),
      auth2: {
        getAuthInstance: jest.fn(() => ({
          currentUser: {
            get: jest.fn(() => ({
              isSignedIn: jest.fn(() => true),
              getBasicProfile: jest.fn(() => ({
                getName: jest.fn(() => "Test User"),
              })),
            })),
          },
          isSignedIn: {
            get: jest.fn(() => true),
            listen: jest.fn(),
          },
        })),
      },
    }

    beforeEach(() => {
      const mockReplace = jest.fn()
      delete (window as any).location
      window.location = {
        ...originalLocation,
        replace: mockReplace,
      } as any
    })

    afterEach(() => {
      window.location = originalLocation as any
    })

    it("redirects from web.app to google for non-staging URLs", () => {
      window.location.hostname = "ga-dev-tools.web.app"
      window.location.href = "https://ga-dev-tools.web.app/feature"
      window.location.pathname = "/feature"
      const { wrapped, store } = withProviders(
        <Layout title="Page Title" pathname={"/"} description="my description">
          Content
        </Layout>
      )
      store.dispatch({ type: "setGapi", gapi })

      renderer.render(wrapped)

      expect(window.location.replace).toHaveBeenCalledWith(
        "https://ga-dev-tools.google/feature"
      )
    })

    it("does not redirect for staging URLs", () => {
      window.location.hostname = "ga-dev-tools-staging.web.app"
      window.location.href = "https://ga-dev-tools-staging.web.app/feature"
      window.location.pathname = "/feature"
      const { wrapped, store } = withProviders(
        <Layout title="Page Title" pathname={"/"} description="my description">
          Content
        </Layout>
      )
      store.dispatch({ type: "setGapi", gapi })

      renderer.render(wrapped)

      expect(window.location.replace).not.toHaveBeenCalled()
    })

    it("does not redirect for non-web.app URLs", () => {
      window.location.hostname = "localhost"
      window.location.href = "http://localhost/feature"
      window.location.pathname = "/feature"
      const { wrapped, store } = withProviders(
        <Layout title="Page Title" pathname={"/"} description="my description">
          Content
        </Layout>
      )
      store.dispatch({ type: "setGapi", gapi })

      renderer.render(wrapped)

      expect(window.location.replace).not.toHaveBeenCalled()
    })
  })
})