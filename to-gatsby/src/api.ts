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
export type Segment = gapi.client.analytics.Segment

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

// TODO - should segments be filtered based on potentially selected dimensions
// and metrics?
export const useSegments = () => {
  const api = useApi()
  const [segments, setSegments] = React.useState<Segment[]>()

  React.useEffect(() => {
    if (api === undefined) {
      return
    }

    api.management.segments.list({}).then(response => {
      setSegments(response.result.items)
    })
  }, [api])

  return segments
}
