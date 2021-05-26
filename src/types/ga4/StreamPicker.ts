export type AccountSummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAccountSummary
export type PropertySummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaPropertySummary

export type WebDataStream = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaWebDataStream
export type AndroidDataStream = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAndroidAppDataStream
export type IosDataStream = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaIosAppDataStream
export enum StreamType {
  Web = "web",
  Android = "android",
  Ios = "iOS",
}
export type Stream =
  | (WebDataStream & { streamType: StreamType.Web })
  | (AndroidDataStream & { streamType: StreamType.Android })
  | (IosDataStream & { streamType: StreamType.Ios })

export interface SelectedStream {
  account?: AccountSummary
  property?: PropertySummary
  stream?: Stream
}

export interface AccountSummariesRequest {
  accountSummaries: AccountSummary[]
}

export interface StreamsRequest {
  web: WebDataStream[]
  android: AndroidDataStream[]
  ios: IosDataStream[]
  streams: Stream[]
}
