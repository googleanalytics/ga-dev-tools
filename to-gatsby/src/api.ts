import { useSelector } from "react-redux"
import React from "react"

interface AnalyticsApi {
  management: typeof gapi.client.management
  metadata: typeof gapi.client.metadata
  data: typeof gapi.client.data
}

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary
export type Column = gapi.client.analytics.Column

export const getAnalyticsApi = (g: typeof gapi): AnalyticsApi => {
  return (g as any).client.analytics
}

export const useApi = (): AnalyticsApi | undefined => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const [api, setApi] = React.useState<AnalyticsApi | undefined>(undefined)

  React.useEffect(() => {
    if (gapi === undefined) {
      return
    }
    setApi(getAnalyticsApi(gapi))
  }, [gapi])

  return api
}
