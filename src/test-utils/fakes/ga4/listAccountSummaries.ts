import { AccountSummary } from "@/types/ga4/StreamPicker"

const page1Summaries: AccountSummary[] = [
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
]
const page2Summaries: AccountSummary[] = [
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
]

const listAccountSummaries: typeof gapi.client.analyticsadmin.accountSummaries.list = ({
  pageToken,
} = {}) => {
  switch (pageToken) {
    case "page2":
      return Promise.resolve({
        result: {
          accountSummaries: page2Summaries,
        },
      }) as any
    case undefined:
      return Promise.resolve({
        result: {
          accountSummaries: page1Summaries,
          nextPageToken: "page2",
        },
      }) as any
  }
}

export default listAccountSummaries
