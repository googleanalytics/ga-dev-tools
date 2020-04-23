interface AnalyticsApi {
  management: typeof gapi.client.management
}

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary

export const getAnalyticsApi = async (): Promise<AnalyticsApi> => {
  // This assumes that gapi has already been loaded.
  return (gapi as any).client.analytics
}
