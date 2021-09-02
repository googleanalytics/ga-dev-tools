import { PartialDeep } from "type-fest"
import ga4ListAccountSummariesFake from "./fakes/ga4/listAccountSummaries"
import uaListAccountSummariesFake from "./fakes/ua/listAccountSummaries"
import uaListColumnsFake from "./fakes/ua/listColumns"

export interface GapiMocks {
  ga4?: {
    listAccountSummaries?: typeof gapi.client.analyticsadmin.accountSummaries.list
  }
  ua?: {
    listAccountSummaries?: typeof gapi.client.analytics.management.accountSummaries.list
  }
}

export const testGapi = (mocks?: GapiMocks): PartialDeep<typeof gapi> => {
  return {
    client: {
      analyticsadmin: {
        properties: {
          iosAppDataStreams: {
            list: jest.fn(),
          },
          androidAppDataStreams: {
            list: jest.fn(),
          },
          webDataStreams: {
            list: jest.fn(),
          },
        },
        accountSummaries: {
          list: mocks?.ga4?.listAccountSummaries
            ? mocks.ga4.listAccountSummaries
            : ga4ListAccountSummariesFake,
        },
      },
      analytics: {
        management: {
          accountSummaries: {
            list: mocks?.ua?.listAccountSummaries
              ? mocks.ua.listAccountSummaries
              : uaListAccountSummariesFake,
          },
        },
        metadata: {
          columns: {
            list: uaListColumnsFake,
          },
        },
      },
    },
  }
}
