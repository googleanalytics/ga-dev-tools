interface AnalyticsApi {
  management: typeof gapi.client.management
}

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary

export const getAnalyticsApi = (g: typeof gapi): AnalyticsApi => {
  return (g as any).client.analytics
}
