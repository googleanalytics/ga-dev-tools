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
import { withProviders } from "../../test-utils"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

import { HitBuilder } from "./index"
import { Property, HIT_TYPES } from "./_types"

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
  const properties: Property[] = []

  test("can render page without error", () => {
    const { wrapped } = withProviders(<HitBuilder properties={properties} />)
    renderer.render(wrapped)
  })

  describe("when unauthorized", () => {
    test("renders without error for an unauthorized user", async () => {
      const { wrapped, store } = withProviders(<HitBuilder properties={properties} />)
      store.dispatch({ type: "setUser", user: undefined })
      const { findByText } = renderer.render(wrapped)
      const result = await findByText("You must be logged in with Google for this demo.")
      expect(result).toBeVisible()
    })
  }
  )

  describe("When authorized", () => {
    // Does right thing when authed (happy path render)

    describe("Initial parameter values are right", () => {
      test("with no query parameters", async () => {
        const { wrapped } = withProviders(
          <HitBuilder properties={properties} />
        )
        const { findByLabelText } = renderer.render(wrapped)

        const { hitPayload } = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue("v=1&t=pageview")
      })

      test("with query parameters for a non-default t parameter", async () => {
        const queryParams = "v=1&t=screenview&tid=UA-fake&cid=abc&an=def&cd=ghi"

        const { wrapped, history } = withProviders(
          <HitBuilder properties={properties} />,
          { path: `/hit-builder?${queryParams}` }
        )
        const { findByLabelText, findAllByLabelText } = renderer.render(wrapped)

        const { v, t, tid, cid, hitPayload } = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue(queryParams)

        // TODO - The select expects seem weird. See if there's a better way to
        // expect the value for a select.
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
      const { wrapped } = withProviders(<HitBuilder properties={properties} />)
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
        const { wrapped } = withProviders(<HitBuilder properties={properties} />)
        const {  getByText, findByLabelText } = renderer.render(wrapped)

        const t = await findByLabelText("t")

        await renderer.act(async () => {
          userEvent.click(t)
          userEvent.selectOptions(t, ['pageview'])
        })

        expect(t).toHaveValue("pageview")
        
      })

      test("when cid parameter is changed", async () => {
        const { wrapped } = withProviders(
          <HitBuilder properties={properties} />
        )
        const { findByLabelText } = renderer.render(wrapped)
        const { cid, hitPayload } = await getInputs(findByLabelText)

        await renderer.act(async () => {
          await userEvent.clear(cid)
          await userEvent.type(cid, 'cid123')

        })

        expect(cid).toHaveValue("cid123")
        expect(hitPayload.value).toContain("cid123")
      })

      test("when tid parameter is changed", async () => {
        const { wrapped } = withProviders(
          <HitBuilder properties={properties} />
        )
        const { findByLabelText } = renderer.render(wrapped)
        const { tid, hitPayload } = await getInputs(findByLabelText)

        await renderer.act(async () => {
          await userEvent.clear(tid)
          await userEvent.type(tid, 'tid123')

        })

        expect(tid).toHaveValue("tid123")
        expect(hitPayload.value).toContain("tid123")
      })

      test("after clicking 'generate uuid' something is generated", async () => {
        const { wrapped } = withProviders(
          <HitBuilder properties={properties} />
        )
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
        const { wrapped } = withProviders(
          <HitBuilder properties={properties} />
        )
        const { findByLabelText, findByText } = renderer.render(wrapped)
        const { hitPayload } = await getInputs(findByLabelText)
        const addParameter = await findByText("Add parameter")

        await renderer.act(async () => {
          userEvent.click(addParameter)

          const newParameterName = await findByLabelText("Parameter name")
          await userEvent.type(newParameterName, "paramName")

          const newParameterValue = await findByLabelText("Value for paramName")
          await userEvent.type(newParameterValue, "paramValue")
        })

        expect(hitPayload.value).toContain("paramName=paramValue")

        // Tests modifying parameter after adding it
        const paramField = await findByLabelText("Parameter name")

        await renderer.act(async () => {
          await userEvent.clear(paramField)
          await userEvent.type(paramField, 'newName')
        })
        expect(paramField).toHaveValue("newName")
        expect(hitPayload.value).toContain("newName=paramValue")

        // Tests modifying param value after param name is changed

        const paramValue = await findByLabelText("Value for newName")

        await renderer.act(async () => {
          await userEvent.clear(paramValue)
          await userEvent.type(paramValue, "paramValue2")
        })
        expect(hitPayload.value).toContain("newName=paramValue2")

      })

      test("updates hit payload when removing parameter", async () => {
        const { wrapped } = withProviders(
          <HitBuilder properties={properties} />
        )
        const { findByLabelText, findByText, findByTestId } = renderer.render(
          wrapped
        )
        const { hitPayload } = await getInputs(findByLabelText)
        const addParameter = await findByText("Add parameter")

        await renderer.act(async () => {
          userEvent.click(addParameter)

          const newParameterName = await findByLabelText("Parameter name")
          await userEvent.type(newParameterName, "paramName")

          const newParameterValue = await findByLabelText("Value for paramName")
          await userEvent.type(newParameterValue, "paramValue")

          const removeParameter = await findByTestId("remove-paramName")
          userEvent.click(removeParameter)
        })

        expect(hitPayload.value).not.toContain("paramName=paramValue")
      })
    })

    describe("Validate hit", () => {
      test("when valid updates the ui accordingly",  async () => {

        const queryParams = "v=1&t=pageview&tid=UA-54516992-1&cid=555&dh=mydemo.com&dp=%2Fhome&dt=homepage"

        const { wrapped, history } = withProviders(
          <HitBuilder properties={properties} />,
          { path: `/hit-builder?${queryParams}` }
        )

        const {findByText, findByLabelText} = renderer.render(
          wrapped
        )

        const {hitPayload} = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue(queryParams)


        const validateButton = await findByText("Validate")
        await renderer.act(async () => {
          await userEvent.click(validateButton)
        })

        const result = await findByText("Hit is valid")
        expect(result).not.toEqual("")
      })
      test("when valid updates the ui accordingly",  async () => {

        const queryParams = "v=1&t=pageview&tid=UA-XXXXX-1&cid=555&dh=mydemo.com&dp=%2Fhome&dt=homepage"

        const { wrapped, history } = withProviders(
          <HitBuilder properties={properties} />,
          { path: `/hit-builder?${queryParams}` }
        )

        const {findByText, findByLabelText} = renderer.render(
          wrapped
        )

        const {hitPayload} = await getInputs(findByLabelText)
        expect(hitPayload).toHaveValue(queryParams)


        const validateButton = await findByText("Validate")
        await renderer.act(async () => {
          await userEvent.click(validateButton)
        })

        const result = await findByText("Hit is invalid")
        expect(result).not.toEqual("")
      })
    })
  })
})
