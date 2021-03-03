import { useSelector } from "react-redux"
import React from "react"

interface AnalyticsApi {
  management: typeof gapi.client.management
  metadata: typeof gapi.client.metadata
  data: typeof gapi.client.data
  reporting: typeof gapi.client.analytics.data
}

export type AccountSummary = gapi.client.analytics.AccountSummary
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary
export type ProfileSummary = gapi.client.analytics.ProfileSummary
export type Column = gapi.client.analytics.Column
export type Segment = gapi.client.analytics.Segment
export type GetReportsResponse = gapi.client.analyticsreporting.GetReportsResponse
export type V4Dimensions = gapi.client.analyticsreporting.Dimension
// export type gapi.client.analyticsreporting.reports

export const getAnalyticsApi = (g: typeof gapi): AnalyticsApi => {
  return (g as any).client.analytics
}

// The interface to the V4 Reporting API. See:
// https://developers.google.com/analytics/devguides/reporting/core/v4/rest
export const useAnalyticsReportingAPI = () => {
  const g = useSelector((state: AppState) => state.gapi)
  const [api, setApi] = React.useState<
    typeof gapi.client.analyticsreporting | undefined
  >()

  React.useEffect(() => {
    if (g === undefined) {
      return
    }
    setApi(g.client.analyticsreporting)
  }, [g])

  return api
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

export const useMetadataAPI = (): typeof gapi.client.metadata | undefined => {
  const g = useSelector((state: AppState) => state.gapi)
  const [api, setApi] = React.useState<typeof gapi.client.metadata | undefined>(
    undefined
  )

  React.useEffect(() => {
    if (g === undefined) {
      return
    }
    setApi(g.client.analytics.metadata as any)
  }, [g])

  return api
}

// TODO - I don't think here is actually a difference between v4 and v3
// dimensions so not sure this is necessary naming-wise.
export const useV4Columns = () => {
  const metadata = useMetadataAPI()
  // TODO - if this works, set & kind: 'DIMENSION'
  const [dimensions, setDimensions] = React.useState<Column[]>()
  const [metrics, setMetrics] = React.useState<Column[]>()

  React.useEffect(() => {
    if (metadata === undefined) {
      return
    }
    metadata.columns.list({ reportType: "ga" }).then(response => {
      const columns = response.result.items || []
      const dimensions = columns.filter(
        column => column.attributes?.type === "DIMENSION"
      )
      setDimensions(dimensions)
      const metrics = columns.filter(
        column => column.attributes?.type === "METRIC"
      )
      setMetrics(metrics)
    })
  }, [metadata])

  return { dimensions, metrics }
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
