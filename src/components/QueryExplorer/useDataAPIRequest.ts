import * as React from "react"

import { V3SamplingLevel } from "@/components/UAPickers"
import { SortableColumn } from "."
import { useSelector } from "react-redux"
import { Column, Segment } from "@/types/ua"

export enum APIStatus {
  Error = "error",
  InProgress = "in-progress",
  Success = "success",
}

export type QueryResponse =
  | { status: APIStatus.Success; response: gapi.client.analytics.GaData }
  | { status: APIStatus.InProgress }
  | {
      status: APIStatus.Error
      error: {
        code: number
        message: string
        errors: Array<{ domain: string; message: string; reason: string }>
      }
    }
  | undefined

type Arg = {
  viewID: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  selectedMetrics: Column[] | undefined
  selectedDimensions: Column[] | undefined
  includeEmptyRows: boolean
  samplingValue: V3SamplingLevel | undefined
  segment: Segment | undefined
  startIndex: string | undefined
  maxResults: string | undefined
  filters: string | undefined
  sort: SortableColumn[] | undefined
}

type UseDataAPIRequest = (
  arg: Arg
) => {
  requiredParameters: boolean
  accessToken: string | undefined
  runQuery: (cb: () => void) => void
  queryResponse: QueryResponse
}

export const useDataAPIRequest: UseDataAPIRequest = ({
  viewID,
  startDate,
  endDate,
  selectedMetrics,
  selectedDimensions,
  includeEmptyRows,
  samplingValue: selectedSamplingValue,
  segment,
  startIndex,
  maxResults,
  filters,
  sort,
}) => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const user = useSelector((a: AppState) => a.user)

  const [queryResponse, setQueryResponse] = React.useState<QueryResponse>()

  const accessToken = React.useMemo(
    () => user?.getAuthResponse().access_token,
    [user]
  )

  const requiredParameters = React.useMemo(() => {
    return (
      viewID !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      selectedMetrics !== undefined &&
      selectedMetrics.length !== 0
    )
  }, [viewID, startDate, endDate, selectedMetrics])

  const runQuery = React.useCallback(
    (cb: () => void) => {
      if (
        viewID === undefined ||
        gapi === undefined ||
        selectedMetrics === undefined ||
        selectedMetrics.length === 0 ||
        startDate === undefined ||
        endDate === undefined
      ) {
        return
      }
      const metrics = selectedMetrics.map(a => a.id).join(",")

      type ApiObject = {
        /** Data format for the response. */
        alt?: string;
        /** A comma-separated list of Analytics dimensions. E.g., 'ga:browser,ga:city'. */
        dimensions?: string;
        /**
         * End date for fetching Analytics data. Request can should specify an end date formatted as YYYY-MM-DD, or as a relative date (e.g., today, yesterday, or 7daysAgo). The default
         * value is yesterday.
         */
        "end-date": string;
        /** Selector specifying which fields to include in a partial response. */
        fields?: string;
        /** A comma-separated list of dimension or metric filters to be applied to Analytics data. */
        filters?: string;
        /** Unique table ID for retrieving Analytics data. Table ID is of the form ga:XXXX, where XXXX is the Analytics view (profile) ID. */
        ids: string;
        /** The response will include empty rows if this parameter is set to true, the default is true */
        "include-empty-rows"?: boolean;
        /** API key. Your API key identifies your project and provides you with API access, quota, and reports. Required unless you provide an OAuth 2.0 token. */
        key?: string;
        /** The maximum number of entries to include in this feed. */
        "max-results"?: number;
        /** A comma-separated list of Analytics metrics. E.g., 'ga:sessions,ga:pageviews'. At least one metric must be specified. */
        metrics: string;
        /** OAuth 2.0 token for the current user. */
        oauth_token?: string;
        /** The selected format for the response. Default format is JSON. */
        output?: string;
        /** Returns response with indentations and line breaks. */
        prettyPrint?: boolean;
        /** An opaque string that represents a user for quota purposes. Must not exceed 40 characters. */
        quotaUser?: string;
        /** The desired sampling level. */
        samplingLevel?: string;
        /** An Analytics segment to be applied to data. */
        segment?: string;
        /** A comma-separated list of dimensions or metrics that determine the sort order for Analytics data. */
        sort?: string;
        /**
         * Start date for fetching Analytics data. Requests can specify a start date formatted as YYYY-MM-DD, or as a relative date (e.g., today, yesterday, or 7daysAgo). The default value
         * is 7daysAgo.
         */
        "start-date": string;
        /** An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter. */
        "start-index"?: number;
        /** Deprecated. Please use quotaUser instead. */
        userIp?: string;
      }

      const apiObject: ApiObject = {
        ids: viewID,
        "start-date": startDate,
        "end-date": endDate,
        "include-empty-rows": includeEmptyRows,
        "metrics": metrics
      }
      if (selectedDimensions !== undefined && selectedDimensions.length !== 0) {
        const dimensions = selectedDimensions?.map(a => a.id).join(",")
        apiObject["dimensions"] = dimensions
      }
      if (selectedSamplingValue !== undefined) {
        apiObject["samplingLevel"] = selectedSamplingValue
      }
      if (segment !== undefined) {
        apiObject["segment"] = segment.segmentId as string
      }
      if (startIndex !== undefined && startIndex !== "") {
        apiObject["start-index"] = parseInt(startIndex)
      }
      if (maxResults !== undefined && maxResults !== "") {
        apiObject["max-results"] = parseInt(maxResults)
      }
      if (filters !== undefined && filters !== "") {
        apiObject["filters"] = filters
      }
      if (sort !== undefined && sort.length > 0) {
        apiObject["sort"] = sort
          .map(a => `${a.sort === "ASCENDING" ? "" : "-"}${a.id}`)
          .join(",")
      }
      setQueryResponse({ status: APIStatus.InProgress })
      gapi.client.analytics.data.ga
        .get(apiObject)
        .then(response => {
          setQueryResponse({
            status: APIStatus.Success,
            response: response.result,
          })
          cb()
        })
        .catch(e => {
          setQueryResponse({ status: APIStatus.Error, error: e.result.error })
        })
    },
    [
      viewID,
      startDate,
      endDate,
      selectedDimensions,
      selectedMetrics,
      segment,
      sort,
      startIndex,
      maxResults,
      filters,
      selectedSamplingValue,
      includeEmptyRows,
      gapi,
    ]
  )

  return { runQuery, requiredParameters, queryResponse, accessToken }
}

export default useDataAPIRequest
