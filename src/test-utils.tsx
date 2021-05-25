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
import { AccountSummary, Column } from "./api"
import { QueryParamProvider } from "use-query-params"

interface WithProvidersConfig {
  path?: string
  isLoggedIn?: boolean
}

export const wrapperFor: (options: {
  path?: string
  isLoggedIn?: boolean
  setUp?: () => void
}) => React.FC = ({ path, isLoggedIn, setUp }) => {
  path = path || "/"
  isLoggedIn = isLoggedIn === undefined ? true : isLoggedIn

  window.localStorage.clear()
  setUp && setUp()

  const history = createHistory(createMemorySource(path))
  const store = makeStore()

  if (isLoggedIn) {
    store.dispatch({ type: "setUser", user: {} })
  } else {
    store.dispatch({ type: "setUser", user: undefined })
  }

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
export const TestWrapper = wrapperFor({})

export const withProviders = (
  component: JSX.Element | null,
  { path, isLoggedIn }: WithProvidersConfig = { path: "/", isLoggedIn: true }
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

  const gapi = testGapi()
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

const testAccounts: AccountSummary[] = [
  {
    id: "account-id-1",
    name: "Account Name 1",
    webProperties: [
      {
        id: "property-id-1-1",
        name: "Property Name 1 1",
        profiles: [
          { id: "view-id-1-1-1", name: "View Name 1 1 1" },
          { id: "view-id-1-1-2", name: "View Name 1 1 2" },
        ],
      },
      {
        id: "property-id-1-2",
        name: "Property Name 1 2",
        profiles: [{ id: "view-id-1-2-1", name: "View Name 1 2 1" }],
      },
    ],
  },
  {
    id: "account-id-2",
    name: "Account Name 2",
    webProperties: [
      {
        id: "property-id-2-1",
        name: "Property Name 2 1",
        profiles: [{ id: "view-id-2-1-1", name: "View Name 2 1 1" }],
      },
    ],
  },
]

const testColumns: Column[] = [
  {
    id: "ga:userType",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "User Type",
      description:
        "A boolean, either New Visitor or Returning Visitor, indicating if the users are new or returning.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:visitorType",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:userType",
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "DEPRECATED",
      uiName: "User Type",
      description:
        "A boolean, either New Visitor or Returning Visitor, indicating if the users are new or returning.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:sessionCount",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "Count of Sessions",
      description:
        "The session index for a user. Each session from a unique user will get its own incremental index starting from 1 for the first session. Subsequent sessions do not change previous session indices. For example, if a user has 4 sessions to the website, sessionCount for that user will have 4 distinct values of '1' through '4'.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:visitCount",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:sessionCount",
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "DEPRECATED",
      uiName: "Count of Sessions",
      description:
        "The session index for a user. Each session from a unique user will get its own incremental index starting from 1 for the first session. Subsequent sessions do not change previous session indices. For example, if a user has 4 sessions to the website, sessionCount for that user will have 4 distinct values of '1' through '4'.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:daysSinceLastSession",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "Days Since Last Session",
      description:
        "The number of days elapsed since users last visited the property, used to calculate user loyalty.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:userDefinedValue",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "User Defined Value",
      description:
        "The value provided when defining custom user segments for the property.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:userBucket",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "User Bucket",
      description:
        "Randomly assigned users tag to allow A/B testing and splitting of remarketing lists. Ranges from 1-100.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:users",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "Users",
      description: "The total number of users for the requested time period.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:visitors",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:users",
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "DEPRECATED",
      uiName: "Users",
      description: "The total number of users for the requested time period.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:newUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "New Users",
      description: "The number of sessions marked as a user's first sessions.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:newVisits",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:newUsers",
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "DEPRECATED",
      uiName: "New Users",
      description: "The number of sessions marked as a user's first sessions.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:percentNewSessions",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "PERCENT",
      group: "User",
      status: "PUBLIC",
      uiName: "% New Sessions",
      description:
        "The percentage of sessions by users who had never visited the property before.",
      calculation: "ga:newUsers / ga:sessions",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:percentNewVisits",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:percentNewSessions",
      type: "METRIC",
      dataType: "PERCENT",
      group: "User",
      status: "DEPRECATED",
      uiName: "% New Sessions",
      description:
        "The percentage of sessions by users who had never visited the property before.",
      calculation: "ga:newUsers / ga:sessions",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:1dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "1 Day Active Users",
      description:
        "Total number of 1-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 1-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:7dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "7 Day Active Users",
      description:
        "Total number of 7-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 7-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:14dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "14 Day Active Users",
      description:
        "Total number of 14-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 14-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:28dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "28 Day Active Users",
      description:
        "Total number of 28-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 28-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:30dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "30 Day Active Users",
      description:
        "Total number of 30-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 30-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:sessionsPerUser",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "FLOAT",
      group: "User",
      status: "PUBLIC",
      uiName: "Number of Sessions per User",
      description:
        "The total number of sessions divided by the total number of users.",
      allowedInSegments: "false",
      addedInApiVersion: "3",
    },
  },
]

const listPromise = Promise.resolve({ result: { items: testAccounts } })
// TODO - add in real type.
const metadataColumnsPromise = Promise.resolve({
  result: {
    items: testColumns,
    etag: "abc123",
  },
})

export const testGapi = () => ({
  client: {
    analyticsadmin: {
      properties: {
        iosAppDataStreams: {
          list: (): Promise<{
            result: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListIosAppDataStreamsResponse
          }> => Promise.resolve({ result: {} }),
        },
        androidAppDataStreams: {
          list: (): Promise<{
            result: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAndroidAppDataStreamsResponse
          }> => Promise.resolve({ result: {} }),
        },
        webDataStreams: {
          list: (): Promise<{
            result: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListWebDataStreamsResponse
          }> => Promise.resolve({ result: {} }),
        },
      },
      accountSummaries: {
        list: ({
          pageToken,
        }: {
          pageToken?: string
        }): Promise<{
          result: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAccountSummariesResponse
        }> => {
          if (pageToken === "1") {
            return Promise.resolve({
              result: {
                accountSummaries: [
                  {
                    account: "accounts/def456",
                    displayName: "my second account",
                    name: "accountSummaries/def",
                    propertySummaries: [
                      {
                        displayName: "my third property",
                        property: "properties/3",
                      },
                      {
                        displayName: "my fourth property",
                        property: "properties/4",
                      },
                    ],
                  },
                ],
              },
            })
          }
          return Promise.resolve({
            result: {
              accountSummaries: [
                {
                  account: "accounts/abc123",
                  displayName: "my first account",
                  name: "accountSummaries/abc",
                  propertySummaries: [
                    {
                      displayName: "my first property",
                      property: "properties/1",
                    },
                    {
                      displayName: "my second property",
                      property: "properties/2",
                    },
                  ],
                },
              ],
              nextPageToken: "1",
            },
          })
        },
      },
    },
    analytics: {
      management: { accountSummaries: { list: () => listPromise } },
      metadata: {
        columns: {
          list: () => {
            return metadataColumnsPromise
          },
        },
      },
    },
  },
})
