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
import { withProviders } from "@/test-utils"
import "@testing-library/jest-dom"
import Sut, { Label, TestID } from "./index"
import useAccountPropertyView from "./useAccountPropertyView"
import { StorageKey } from "@/constants"
import { fireEvent, within } from "@testing-library/react"

enum QueryParam {
  Account = "a",
  Property = "b",
  View = "c",
}

describe("ViewSelector", () => {
  const DefaultSut: React.FC = () => {
    const apv = useAccountPropertyView("a" as StorageKey, QueryParam)
    return <Sut {...apv} />
  }
  test("doesn't crash on happy path", async () => {
    const { wrapped } = withProviders(<DefaultSut />)
    const { findByLabelText } = renderer.render(wrapped)

    const account = await findByLabelText(Label.Account)
    expect(account).toBeVisible()

    const property = await findByLabelText(Label.Property)
    expect(property).toBeVisible()

    const view = await findByLabelText(Label.View)
    expect(view).toBeVisible()
  })
  test("can select account with no properties", async () => {
    const accountName = "my account name"
    const listAccountSummaries = jest.fn()
    listAccountSummaries.mockReturnValue(
      Promise.resolve({
        result: {
          items: [{ name: accountName, id: "account id", properties: [] }],
        },
      })
    )
    const { wrapped } = withProviders(<DefaultSut />, {
      ua: { listAccountSummaries },
    })
    const { findByTestId } = renderer.render(wrapped)

    // Select first account.
    const accountAC = await findByTestId(TestID.AccountAutocomplete)
    fireEvent.keyDown(accountAC, { key: "ArrowDown" })
    fireEvent.keyDown(accountAC, { key: "Enter" })

    const accountInput = within(accountAC).getByRole("textbox")
    expect(accountInput).toHaveValue(accountName)
  })
  describe("with autoFill={true}", () => {
    const WithAutoFill: React.FC = () => {
      const apv = useAccountPropertyView("a" as StorageKey, QueryParam)
      return <Sut {...apv} autoFill />
    }
    test("automatically selects account & view when both available", async () => {
      const { wrapped } = withProviders(<WithAutoFill />)
      const { findByTestId } = renderer.render(wrapped)

      // Select first account.
      const accountAC = await findByTestId(TestID.AccountAutocomplete)
      fireEvent.keyDown(accountAC, { key: "ArrowDown" })
      fireEvent.keyDown(accountAC, { key: "Enter" })

      const accountInput = within(accountAC).getByRole("textbox")
      expect(accountInput).toHaveValue("Account Name 1")

      const propertyAC = await findByTestId(TestID.PropertyAutocomplete)
      const propertyInput = within(propertyAC).getByRole("textbox")
      expect(propertyInput).toHaveValue("Property Name 1 1")

      const viewAC = await findByTestId(TestID.ViewAutocomplete)
      const viewInput = within(viewAC).getByRole("textbox")
      expect(viewInput).toHaveValue("View Name 1 1 1")
    })
  })
  describe("with autoFill={false}", () => {
    const NoAutoFill: React.FC = () => {
      const apv = useAccountPropertyView("a" as StorageKey, QueryParam)
      return <Sut {...apv} autoFill={false} />
    }
    test("doesn't automatically select property or view after selecting property", async () => {
      const { wrapped } = withProviders(<NoAutoFill />)
      const { findByTestId } = renderer.render(wrapped)

      // Select first account.
      const accountAC = await findByTestId(TestID.AccountAutocomplete)
      fireEvent.keyDown(accountAC, { key: "ArrowDown" })
      fireEvent.keyDown(accountAC, { key: "Enter" })

      const accountInput = within(accountAC).getByRole("textbox")
      expect(accountInput).toHaveValue("Account Name 1")

      const propertyAC = await findByTestId(TestID.PropertyAutocomplete)
      const propertyInput = within(propertyAC).getByRole("textbox")
      expect(propertyInput).toHaveValue("")

      const viewAC = await findByTestId(TestID.ViewAutocomplete)
      const viewInput = within(viewAC).getByRole("textbox")
      expect(viewInput).toHaveValue("")
    })
  })
})
