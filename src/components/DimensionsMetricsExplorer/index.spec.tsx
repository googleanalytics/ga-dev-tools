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

import DimensionMetricsExplorer from "./index"

describe("Dimensions and Metrics Explorer", () => {
  // This test may go out of date, but we want at least once instance of making
  // sure the intersection logic works for compatable dimensions.
  it("disables incompatable metric when 'User Type' dimension is selected", async () => {
    const { wrapped, gapi } = withProviders(<DimensionMetricsExplorer />)
    const { getByText, findByLabelText } = renderer.render(wrapped)

    // Wait for api promise to resolve so it won't render "fetching".
    await renderer.act(async () => {
      // metadata: { columns: { list: () => metadataColumnsPromise } },
      await gapi!.client!.analytics!.metadata!.columns!.list!()
      // await gapi.client.analytics.management.accountSummaries.list()
    })

    await renderer.act(async () => {
      userEvent.click(getByText("User"))
      const userType = await findByLabelText(/User Type/)
      const oneDayActiveUsers = await findByLabelText(/1 Day Active Users/)
      expect(userType).not.toBeDisabled()
      expect(oneDayActiveUsers).not.toBeDisabled()
      userEvent.click(userType)
      expect(oneDayActiveUsers).toBeDisabled()
    })
  })
})
