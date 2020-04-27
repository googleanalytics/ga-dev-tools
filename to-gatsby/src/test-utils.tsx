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
import { Provider } from "react-redux"
import { makeStore } from "../gatsby/wrapRootElement"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
  History,
} from "@reach/router"

interface WithProvidersConfig {
  path: string
  measurementID?: string
}

export const withProviders = (
  component: JSX.Element | null,
  { measurementID, path }: WithProvidersConfig = { path: "/" }
): {
  wrapped: JSX.Element
  history: History
  store: any
} => {
  const history = createHistory(createMemorySource(path))
  if (measurementID) {
    process.env.GATSBY_GA_MEASUREMENT_ID = measurementID
  }
  const store = makeStore()
  const wrapped = (
    <Provider store={store}>
      <LocationProvider history={history}>{component}</LocationProvider>
    </Provider>
  )
  return { wrapped, history, store }
}
