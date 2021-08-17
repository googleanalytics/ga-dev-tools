export type AccountSummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAccountSummary
export type PropertySummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaPropertySummary

export type WebDataStream = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaWebDataStream
export type AndroidDataStream = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAndroidAppDataStream
export type IOSDataStream = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaIosAppDataStream

export enum StreamType {
  WebDataStream = "web",
  AndroidDataStream = "android",
  IOSDataStream = "ios",
}
export type Stream =
  | { type: StreamType.WebDataStream; value: WebDataStream }
  | { type: StreamType.AndroidDataStream; value: AndroidDataStream }
  | { type: StreamType.IOSDataStream; value: IOSDataStream }

export interface AccountSummaries {
  accounts: AccountSummary[]
}
