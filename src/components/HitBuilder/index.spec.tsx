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
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

import { withProviders } from "@/test-utils"
import HitBuilder from "./index"

const getInputs = async (
  findByLabelText: (label: string) => Promise<HTMLElement>
) => {
  const v = await findByLabelText("v")
  const t = await findByLabelText("t")
  const tid = await findByLabelText("tid")
  const cid = (await findByLabelText("cid")) as HTMLInputElement
  const hitPayload = (await findByLabelText("Hit payload")) as HTMLInputElement

  return { v, t, tid, cid, hitPayload }
}

describe("HitBuilder", () => {
  // test("can render page without error", () => {
  //   const { wrapped } = withProviders(<HitBuilder />)
  //   renderer.render(wrapped)
  // })

  //  TODO - Make tests for layout.spec.tsx that makes sure that all demos that
  //  should require auth do.

  describe("When authorized", () => {
    describe("Initial parameter values are right", () => {
      test("with no query parameters", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText } = renderer.render(wrapped)

        const { hitPayload } = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue("v=1&t=pageview")
      })

      test("with query parameters for a non-default t parameter", async () => {
        const queryParams = "v=1&t=screenview&tid=UA-fake&cid=abc&an=def&cd=ghi"

        const { wrapped, history } = withProviders(<HitBuilder />, {
          path: `/hit-builder?${queryParams}`,
        })
        const { findByLabelText, findAllByLabelText } = renderer.render(wrapped)

        const { v, t, tid, cid, hitPayload } = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue(queryParams)

        expect(v).toContainHTML("1")
        expect(t).toHaveValue("screenview")
        expect(tid).toHaveValue("UA-fake")
        expect(cid).toHaveValue("abc")

        const parameterLabels = await findAllByLabelText("Parameter name")
        expect(parameterLabels).toHaveLength(2)

        // an parameter
        expect(parameterLabels[0]).toHaveValue("an")
        const def = await findByLabelText("Value for an")
        expect(def).toHaveValue("def")

        // cd parameter
        expect(parameterLabels[1]).toHaveValue("cd")
        const ghi = await findByLabelText("Value for cd")
        expect(ghi).toHaveValue("ghi")

        // location.search should be reset
        expect(history.location.search.substring(1)).not.toEqual(queryParams)
        expect(history.location.search).toEqual("")
      })
    })

    test("adding a parameter gives its name label focus", async () => {
      const { wrapped } = withProviders(<HitBuilder />)
      const { findAllByLabelText, findByText } = renderer.render(wrapped)

      const addParameter = await findByText("Add parameter")

      await renderer.act(async () => {
        userEvent.click(addParameter)
      })

      // Check that new field is focused
      const parameterLabels = await findAllByLabelText("Parameter name")
      expect(parameterLabels).toHaveLength(1)
      expect(parameterLabels[0]).toHaveFocus()
    })

    describe("updates the hit payload", () => {
      test("when t parameter is changed", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText } = renderer.render(wrapped)

        const t = await findByLabelText("t")

        await renderer.act(async () => {
          await userEvent.type(t, "{selectall}{backspace}pageview", {
            delay: 50,
          })
        })

        expect(t).toHaveValue("pageview")
      })

      test("when cid parameter is changed", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText } = renderer.render(wrapped)
        const { cid, hitPayload } = await getInputs(findByLabelText)

        await renderer.act(async () => {
          userEvent.clear(cid)
          await userEvent.type(cid, "cid123", { delay: 50 })
        })

        expect(cid).toHaveValue("cid123")
        expect(hitPayload.value).toContain("cid123")
      })

      test("when tid parameter is changed", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText } = renderer.render(wrapped)
        const { tid, hitPayload } = await getInputs(findByLabelText)

        await renderer.act(async () => {
          userEvent.clear(tid)
          await userEvent.type(tid, "tid123", { delay: 50 })
        })

        expect(tid).toHaveValue("tid123")
        expect(hitPayload.value).toContain("tid123")
      })

      test("clicking 'generate uuid' generates a... uuid???", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText, findByTestId } = renderer.render(wrapped)
        const { cid, hitPayload } = await getInputs(findByLabelText)

        await renderer.act(async () => {
          const generateUuid = await findByTestId("generate-uuid")
          userEvent.click(generateUuid)
        })

        expect(cid.value).not.toEqual("")
        expect(hitPayload.value).toContain(cid.value)
      })
    })

    describe("when adding a parameter", () => {
      test("updates hit payload when adding or changing parameter name & value", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText, findByText } = renderer.render(wrapped)
        const { hitPayload } = await getInputs(findByLabelText)
        const addParameter = await findByText("Add parameter")

        await renderer.act(async () => {
          userEvent.click(addParameter)

          const newParameterName = await findByLabelText("Parameter name")
          await userEvent.type(newParameterName, "paramName", { delay: 50 })

          const newParameterValue = await findByLabelText("Value for paramName")
          await userEvent.type(newParameterValue, "paramValue", { delay: 50 })
        })

        expect(hitPayload.value).toContain("paramName=paramValue")

        // Tests modifying parameter after adding it
        const paramField = await findByLabelText("Parameter name")

        await renderer.act(async () => {
          await userEvent.type(paramField, "{selectall}{backspace}newName", {
            delay: 50,
          })
        })
        expect(paramField).toHaveValue("newName")
        expect(hitPayload.value).toContain("newName=paramValue")

        // Tests modifying param value after param name is changed

        const paramValue = await findByLabelText("Value for newName")

        await renderer.act(async () => {
          await userEvent.type(
            paramValue,
            "{selectall}{backspace}paramValue2",
            { delay: 50 }
          )
        })
        expect(hitPayload.value).toContain("newName=paramValue2")
      })

      test("updates hit payload when removing parameter", async () => {
        const { wrapped } = withProviders(<HitBuilder />)
        const { findByLabelText, findByText, findByTestId } = renderer.render(
          wrapped
        )
        const { hitPayload } = await getInputs(findByLabelText)
        const addParameter = await findByText("Add parameter")

        await renderer.act(async () => {
          userEvent.click(addParameter)

          const newParameterName = await findByLabelText("Parameter name")
          await userEvent.type(newParameterName, "paramName", { delay: 50 })

          const newParameterValue = await findByLabelText("Value for paramName")
          await userEvent.type(newParameterValue, "paramValue", { delay: 50 })

          const removeParameter = await findByTestId("remove-paramName")
          userEvent.click(removeParameter)
        })

        expect(hitPayload.value).not.toContain("paramName=paramValue")
      })
    })

    describe("Validate hit", () => {
      // TODO this should be cleaned up through types and better (global?)
      // mocks in the future.
      const fetchMock = jest.fn(async () => ({
        json: async () => ({
          parserMessage: [],
          hitParsingResult: [{ valid: true, parserMessage: [], hit: "" }],
        }),
      }))
      ;(global as any).fetch = fetchMock

      test("when valid updates the ui accordingly", async () => {
        const queryParams =
          "v=1&t=pageview&tid=UA-54516992-1&cid=555&dh=mydemo.com&dp=%2Fhome&dt=homepage"

        const { wrapped } = withProviders(<HitBuilder />, {
          path: `/hit-builder?${queryParams}`,
        })

        const { findByText, findByLabelText } = renderer.render(wrapped)

        const { hitPayload } = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue(queryParams)

        const validateHitButton = renderer.screen.getByText("Validate hit")
        await renderer.act(async () => {
          validateHitButton.click()
        })

        const result = await findByText("Hit is valid!")
        expect(result).not.toEqual("")
      })
    })
  })
})
