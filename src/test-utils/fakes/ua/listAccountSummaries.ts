import { AccountSummary } from "@/types/ua"

const accountSummaries: AccountSummary[] = [
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

const listAccountSummaries: typeof gapi.client.analytics.management.accountSummaries.list = () => {
  return Promise.resolve({ result: { items: accountSummaries } }) as any
}

export default listAccountSummaries
