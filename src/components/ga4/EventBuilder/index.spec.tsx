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
import userEvent from "@testing-library/user-event"
import { within } from "@testing-library/react"

describe("Event Builder", () => {
  test("can render page without error", () => {
    const { wrapped } = withProviders(<Sut />)
    renderer.render(wrapped)
  })

  describe("when not authorized", () => {
    describe("renders all expected inputs", () => {
      test("for firebase switch", async () => {
        const { wrapped } = withProviders(<Sut />, { isLoggedIn: false })
        const { findByLabelText } = renderer.render(wrapped)

        await findByLabelText(Label.APISecret, { exact: false })

        await findByLabelText(Label.FirebaseAppID, { exact: false })
        await findByLabelText(Label.AppInstanceID, { exact: false })

        await findByLabelText(Label.UserId, { exact: false })
        await findByLabelText(Label.EventCategory, { exact: false })
        await findByLabelText(Label.EventName, { exact: false })
        await findByLabelText(Label.TimestampMicros, { exact: false })
        await findByLabelText(Label.NonPersonalizedAds, { exact: false })
      })
      test("for gtag switch", async () => {
        const { wrapped } = withProviders(<Sut />, { isLoggedIn: false })
        const { findByLabelText, findByTestId } = renderer.render(wrapped)

        await renderer.act(async () => {
          // Choose the second view in the list
          const clientToggle = await findByTestId("use firebase")
          clientToggle.click()
        })

        await findByLabelText(Label.APISecret, { exact: false })

        await findByLabelText(Label.MeasurementID, { exact: false })
        await findByLabelText(Label.ClientID, { exact: false })

        await findByLabelText(Label.UserId, { exact: false })
        await findByLabelText(Label.EventCategory, { exact: false })
        await findByLabelText(Label.EventName, { exact: false })
        await findByLabelText(Label.TimestampMicros, { exact: false })
        await findByLabelText(Label.NonPersonalizedAds, { exact: false })
      })
    })
    describe("with all inputs filled", () => {
      describe("for firebase switch", () => {
        test("generates correct payload", async () => {
          const { wrapped } = withProviders(<Sut />, {
            isLoggedIn: false,
          })
          const { findByLabelText: find, findByTestId } = renderer.render(
            wrapped
          )

          const apiSecret = await find(Label.APISecret, { exact: false })
          const firebaseAppId = await find(Label.FirebaseAppID, {
            exact: false,
          })
          const appInstanceId = await find(Label.AppInstanceID, {
            exact: false,
          })
          const userId = await find(Label.UserId, { exact: false })
          const eventCategory = await findByTestId(Label.EventCategory)
          const eventName = await findByTestId(Label.EventName)
          const timestampMicros = await find(Label.TimestampMicros, {
            exact: false,
          })
          const nonPersonalizedAds = await find(Label.NonPersonalizedAds, {
            exact: false,
          })

          await renderer.act(async () => {
            await userEvent.type(apiSecret, "my_secret", { delay: 1 })
            await userEvent.type(firebaseAppId, "my_firebase_app_id", {
              delay: 1,
            })
            await userEvent.type(appInstanceId, "my_instance_id", { delay: 1 })
            await userEvent.type(userId, "my_user_id", { delay: 1 })

            // TODO - I'm pretty unhappy with this, but I'm having a lot of
            // trouble testing the Autocomplete component without doing this.
            // This test is somewhat likely to break if we add/remove events &
            // event categories so if it's broken, it's probably fine to just
            // change the expected values.
            const ecInput = within(eventCategory).getByRole("textbox")
            eventCategory.focus()
            renderer.fireEvent.change(ecInput, { target: { value: "" } })
            renderer.fireEvent.keyDown(eventCategory, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventCategory, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventCategory, { key: "Enter" })

            const enInput = within(eventName).getByRole("textbox")
            eventCategory.focus()
            renderer.fireEvent.change(enInput, { target: { value: "" } })
            renderer.fireEvent.keyDown(eventName, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventName, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventName, { key: "Enter" })

            await userEvent.type(timestampMicros, "1234", { delay: 1 })
            nonPersonalizedAds.click()
          })

          const validatePaper = await findByTestId("validate and send")
          expect(validatePaper).toHaveTextContent(/api_secret=my_secret/)
          expect(validatePaper).toHaveTextContent(
            /firebase_app_id=my_firebase_app_id/
          )

          const payload = await findByTestId("payload")
          expect(payload).toHaveTextContent(
            /"app_instance_id":"my_instance_id"/
          )
          expect(payload).toHaveTextContent(/"user_id":"my_user_id"/)
          expect(payload).toHaveTextContent(/"timestamp_micros":"1234"/)
          expect(payload).toHaveTextContent(/"non_personalized_ads":true/)
          expect(payload).toHaveTextContent(/"name":"add_shipping_info"/)
        })
      })
      describe("for gtag switch", () => {
        test("generates correct payload", async () => {
          const { wrapped } = withProviders(<Sut />, {
            isLoggedIn: false,
          })

          const { findByLabelText: find, findByTestId } = renderer.render(
            wrapped
          )

          await renderer.act(async () => {
            // Choose the second view in the list
            const clientToggle = await findByTestId("use firebase")
            clientToggle.click()
          })

          const apiSecret = await find(Label.APISecret, { exact: false })
          const measurementId = await find(Label.MeasurementID, {
            exact: false,
          })
          const clientId = await find(Label.ClientID, { exact: false })
          const userId = await find(Label.UserId, { exact: false })
          const eventCategory = await findByTestId(Label.EventCategory)
          const eventName = await findByTestId(Label.EventName)
          const timestampMicros = await find(Label.TimestampMicros, {
            exact: false,
          })
          const nonPersonalizedAds = await find(Label.NonPersonalizedAds, {
            exact: false,
          })

          await renderer.act(async () => {
            await userEvent.type(apiSecret, "my_secret", { delay: 1 })
            await userEvent.type(measurementId, "my_measurement_id", {
              delay: 1,
            })
            await userEvent.type(clientId, "my_client_id", { delay: 1 })
            await userEvent.type(userId, "{selectall}{backspace}my_user_id", {
              delay: 1,
            })

            // TODO - I'm pretty unhappy with this, but I'm having a lot of
            // trouble testing the Autocomplete component without doing this.
            // This test is somewhat likely to break if we add/remove events &
            // event categories so if it's broken, it's probably fine to just
            // change the expected values.
            const ecInput = within(eventCategory).getByRole("textbox")
            eventCategory.focus()
            renderer.fireEvent.change(ecInput, { target: { value: "" } })
            renderer.fireEvent.keyDown(eventCategory, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventCategory, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventCategory, { key: "Enter" })

            const enInput = within(eventName).getByRole("textbox")
            eventCategory.focus()
            renderer.fireEvent.change(enInput, { target: { value: "" } })
            renderer.fireEvent.keyDown(eventName, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventName, { key: "ArrowDown" })
            renderer.fireEvent.keyDown(eventName, { key: "Enter" })

            await userEvent.type(
              timestampMicros,
              "{selectall}{backspace}1234",
              { delay: 1 }
            )
            nonPersonalizedAds.click()
          })

          const validatePaper = await findByTestId("validate and send")
          expect(validatePaper).toHaveTextContent(/api_secret=my_secret/)
          expect(validatePaper).toHaveTextContent(
            /measurement_id=my_measurement_id/
          )

          const payload = await findByTestId("payload")
          expect(payload).toHaveTextContent(/"client_id":"my_client_id"/)
          expect(payload).toHaveTextContent(/"user_id":"my_user_id"/)
          expect(payload).toHaveTextContent(/"timestamp_micros":"1234"/)
          expect(payload).toHaveTextContent(/"non_personalized_ads":true/)
          expect(payload).toHaveTextContent(/"name":"add_shipping_info"/)
        })
      })
    })
  })
})
