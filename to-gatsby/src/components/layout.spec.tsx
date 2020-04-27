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
import { withProviders } from "../test-utils"

import Layout from "./layout"
import { usePageView } from "./layout"

const TestMeasurementId = "abc"

beforeEach(() => {
  process.env.GATSBY_GA_MEASUREMENT_ID = TestMeasurementId
  window.gtag = jest.fn()
})

describe("Layout", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        withProviders(<Layout title="Page Title">Content</Layout>).wrapped
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe("usePageView hook", () => {
  describe("when gtag is undefined", () => {
    test("and stays that way doesn't rendered forever", () => {
      jest.useFakeTimers()
      const hookValues: ReturnType<typeof usePageView>[] = []
      ;(window.gtag as any) = undefined
      const TestComponent: React.FC = () => {
        const runData = usePageView()
        hookValues.push(runData)
        return null
      }
      const component = withProviders(<TestComponent />).wrapped
      renderer.create(component)
      // advance the timer more times than necessary so we can make sure this runs
      // enough times.
      for (let i = 0; i < 30; i++) {
        renderer.act(() => {
          jest.advanceTimersByTime(40)
        })
      }
      // Make sure that it was never able to measure since gtag was undefined
      // the entire time.
      expect(hookValues.every(a => a.couldMeasure === false))
      // Make sure that the hook tried to run at least a few times before giving up.
      expect(hookValues.length).toBeGreaterThan(1)
    })
    test("but is defined later", () => {
      const gtagMock = jest.fn()
      const pathOverride = "/hello"
      jest.useFakeTimers()
      const capturedValues: any[] = []
      ;(window.gtag as any) = undefined
      const TestComponent: React.FC = () => {
        const runData = usePageView()
        capturedValues.push(runData)
        return null
      }
      const component = withProviders(<TestComponent />, pathOverride).wrapped

      renderer.create(component)
      renderer.act(() => {
        jest.advanceTimersByTime(100)
      })
      window.gtag = gtagMock
      renderer.act(() => {
        jest.advanceTimersByTime(100)
      })

      // Make sure that couldMeasure was eventually true.
      expect(capturedValues.every(a => a.couldMeasure === false)).toBeFalsy()
      const gtagCalls = gtagMock.mock.calls
      expect(gtagCalls).toHaveLength(1)
      expect(gtagCalls[0]).toEqual([
        "config",
        TestMeasurementId,
        { page_path: pathOverride },
      ])
    })
  })
  describe("when gtag is defined", () => {
    test("and user navigates to page", async () => {
      const gtagMock = jest.fn()
      window.gtag = gtagMock
      const path1 = "/hello"
      const path2 = "/second"
      const TestComponent: React.FC = () => {
        usePageView()
        return null
      }
      const { wrapped: component, history } = withProviders(
        <TestComponent />,
        path1
      )

      renderer.create(component)
      await renderer.act(async () => {
        // Navigate to another page
        await history.navigate(path2)
      })
      const gtagCalls = gtagMock.mock.calls
      expect(gtagCalls).toHaveLength(2)
      expect(gtagCalls[0]).toEqual([
        "config",
        TestMeasurementId,
        { page_path: path1 },
      ])
      expect(gtagCalls[1]).toEqual([
        "config",
        TestMeasurementId,
        { page_path: path2 },
      ])
    })
  })
})
