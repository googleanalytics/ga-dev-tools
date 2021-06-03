import { useSelector } from "react-redux"
import React from "react"

// TODO - this file should be removed and the api-specific things for each demo
// should be handled like in request-composer.
interface AnalyticsApi {
  management: typeof gapi.client.analytics.management
  metadata: typeof gapi.client.analytics.metadata
  data: typeof gapi.client.analytics.data
  reporting: typeof gapi.client.analytics.data
}

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary
export type Column = gapi.client.analytics.Column
export type Segment = gapi.client.analytics.Segment
export type GetReportsResponse = gapi.client.analyticsreporting.GetReportsResponse
export type V4Dimensions = gapi.client.analyticsreporting.Dimension

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

export const useMetadataAPI = ():
  | typeof gapi.client.analytics.metadata
  | undefined => {
  const g = useSelector((state: AppState) => state.gapi)
  const [api, setApi] = React.useState<
    typeof gapi.client.analytics.metadata | undefined
  >(undefined)

  React.useEffect(() => {
    if (g === undefined) {
      return
    }
    setApi(g.client.analytics.metadata as any)
  }, [g])

  return api
}

// TODO - should segments be filtered based on potentially selected dimensions
// and metrics?
// TODO - This should be cached locally since it's used in a lot of places.
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
