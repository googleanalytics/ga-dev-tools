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
import { makeStore } from "../../gatsby/wrapRootElement"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
  History,
} from "@reach/router"
import { QueryParamProvider } from "use-query-params"
import { GapiMocks, testGapi } from "./gapi"

export { testGapi } from "./gapi"

export interface WithProvidersConfig extends GapiMocks {
  path?: string
  isLoggedIn?: boolean
  setUp?: () => void
}

export const wrapperFor = ({
  path = "/",
  isLoggedIn = true,
  setUp,
  ...gapiMocks
}: WithProvidersConfig = {}): React.FC => {
  window.localStorage.clear()
  setUp && setUp()

  const history = createHistory(createMemorySource(path))
  const store = makeStore()

  if (isLoggedIn) {
    store.dispatch({ type: "setUser", user: {} })
  } else {
    store.dispatch({ type: "setUser", user: undefined })
  }

  const gapi = testGapi(gapiMocks)
  store.dispatch({ type: "setGapi", gapi })

  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <LocationProvider history={history}>
        <QueryParamProvider {...{ default: true }} reachHistory={history}>
          {children}
        </QueryParamProvider>
      </LocationProvider>
    </Provider>
  )
  return Wrapper
}
export const TestWrapper = wrapperFor()

export const withProviders = (
  component: JSX.Element | null,
  { path, isLoggedIn, ...gapiMocks }: WithProvidersConfig = {
    path: "/",
    isLoggedIn: true,
    ga4: {},
    ua: {},
  }
): {
  wrapped: JSX.Element
  history: History
  store: any
  gapi: ReturnType<typeof testGapi>
} => {
  path = path || "/"
  isLoggedIn = isLoggedIn === undefined ? true : isLoggedIn

  window.localStorage.clear()

  const history = createHistory(createMemorySource(path))
  const store = makeStore()

  if (isLoggedIn) {
    store.dispatch({ type: "setUser", user: {} })
  } else {
    store.dispatch({ type: "setUser", user: undefined })
  }

  const gapi = testGapi(gapiMocks)
  store.dispatch({ type: "setGapi", gapi })

  const wrapped = (
    <Provider store={store}>
      <LocationProvider history={history}>
        <QueryParamProvider reachHistory={history}>
          {component}
        </QueryParamProvider>
      </LocationProvider>
    </Provider>
  )
  return { wrapped, history, store, gapi }
}
