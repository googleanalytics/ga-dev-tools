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

      const apiObject = {
        ids: viewID,
        "start-date": startDate,
        "end-date": endDate,
        "include-empty-rows": includeEmptyRows,
        metrics,
      }
      if (selectedDimensions !== undefined && selectedDimensions.length !== 0) {
        const dimensions = selectedDimensions?.map(a => a.id).join(",")
        apiObject["dimensions"] = dimensions
      }
      if (selectedSamplingValue !== undefined) {
        apiObject["samplingLevel"] = selectedSamplingValue
      }
      if (segment !== undefined) {
        apiObject["segment"] = segment.segmentId
      }
      if (startIndex !== undefined && startIndex !== "") {
        apiObject["start-index"] = startIndex
      }
      if (maxResults !== undefined && maxResults !== "") {
        apiObject["max-results"] = maxResults
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
