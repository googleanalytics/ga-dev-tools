export type Column = gapi.client.analytics.Column
export type Segment = gapi.client.analytics.Segment

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary

export interface UAAccountPropertyView {
  account?: AccountSummary
  property?: WebPropertySummary
  view?: ProfileSummary
}
