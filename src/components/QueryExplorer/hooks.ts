import * as React from "react"

import { Segment, Column, useApi } from "@/api"
import {
  usePersistentBoolean,
  usePersistentString,
  usePersistantObject,
} from "@/hooks"
import { StorageKey } from "@/constants"
import { V3SamplingLevel } from "@/components/UAPickers"
import { HasView } from "@/components/ViewSelector"
import { SortableColumn } from "."

export const useInputs = () => {
  const [view, setView] = React.useState("")
  const [startDate, setStartDate] = usePersistentString(
    StorageKey.queryExplorerStartDate,
    "7daysAgo"
  )
  const [endDate, setEndDate] = usePersistentString(
    StorageKey.queryExplorerEndDate,
    "yesterday"
  )
  const [startIndex, setStartIndex] = usePersistentString(
    StorageKey.queryExplorerStartIndex
  )
  const [maxResults, setMaxResults] = usePersistentString(
    StorageKey.queryExplorerMaxResults
  )
  // Nice to have - Improve filters with a filter builder that helps to create
  // valid filters. It's currently very easy to create in invalid filter such
  // as:
  //
  // ga:sessionCount>10
  //
  // This doesn't work since sessionCount is a dimension.
  const [filters, setFilters] = usePersistentString(
    StorageKey.queryExplorerFilters
  )
  const [selectedSegment, setSelectedSegment] = React.useState<Segment>()
  const [selectedMetrics, setSelectedMetrics] = React.useState<Column[]>()
  const [selectedDimensions, setSelectedDimensions] = React.useState<Column[]>()
  const [includeEmptyRows, setIncludeEmptyRows] = usePersistentBoolean(
    StorageKey.queryExplorerIncludeEmptyRows,
    true
  )
  const [showSegmentDefinition, setShowSegmentDefiniton] = usePersistentBoolean(
    StorageKey.queryExplorerShowSegmentDefinition,
    false
  )
  const [selectedSamplingValue, setSelectedSamplingValue] = React.useState<
    V3SamplingLevel | undefined
  >(V3SamplingLevel.Default)

  const [selectedView, setSelectedView] = React.useState<HasView | undefined>(
    undefined
  )
  const [sort, setSort] = usePersistantObject<SortableColumn[]>(
    StorageKey.queryExplorerSort
  )

  const onViewChanged = React.useCallback(view => {
    if ([view.view, view.account, view.property].every(a => a !== undefined)) {
      setSelectedView(view as HasView)
    }
  }, [])

  // When the selected view is changed, update the text box for view with the
  // id.
  React.useEffect(() => {
    if (selectedView === undefined) {
      return
    }
    const viewId = `ga:${selectedView.view.id}`
    setView(viewId)
  }, [selectedView])

  return {
    selectedView,
    setSelectedView,
    sort,
    setSort,
    view,
    setView,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startIndex,
    setStartIndex,
    maxResults,
    setMaxResults,
    filters,
    setFilters,
    selectedSegment,
    setSelectedSegment,
    selectedMetrics,
    setSelectedMetrics,
    selectedDimensions,
    setSelectedDimensions,
    includeEmptyRows,
    setIncludeEmptyRows,
    showSegmentDefinition,
    setShowSegmentDefiniton,
    selectedSamplingValue,
    setSelectedSamplingValue,
    onViewChanged,
  }
}

type UseDataAPIRequest = (inputs: {
  view: string
  startDate: string | undefined
  endDate: string | undefined
  selectedMetrics: Column[] | undefined
  selectedDimensions: Column[] | undefined
  includeEmptyRows: boolean
  selectedSamplingValue: V3SamplingLevel | undefined
  selectedSegment: Segment | undefined
  startIndex: string | undefined
  maxResults: string | undefined
  filters: string | undefined
  sort: SortableColumn[] | undefined
}) => {
  requiredParameters: boolean
  runQuery: () => void
  queryResponse: QueryResponse
}

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

export const useDataAPIRequest: UseDataAPIRequest = ({
  view,
  startDate,
  endDate,
  selectedMetrics,
  selectedDimensions,
  includeEmptyRows,
  selectedSamplingValue,
  selectedSegment,
  startIndex,
  maxResults,
  filters,
  sort,
}) => {
  const api = useApi()

  const [queryResponse, setQueryResponse] = React.useState<QueryResponse>()

  const requiredParameters = React.useMemo(() => {
    return (
      view !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      selectedMetrics !== undefined &&
      selectedMetrics.length !== 0
    )
  }, [view, startDate, endDate, selectedMetrics])

  const runQuery = React.useCallback(() => {
    if (
      api === undefined ||
      selectedMetrics === undefined ||
      selectedMetrics.length === 0 ||
      startDate === undefined ||
      endDate === undefined
    ) {
      return
    }
    const metrics = selectedMetrics.map(a => a.id).join(",")

    const apiObject = {
      ids: view,
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
    if (selectedSegment !== undefined) {
      apiObject["segment"] = selectedSegment.segmentId
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
    if (sort !== undefined) {
      apiObject["sort"] = sort
        .map(a => `${a.sort === "ASCENDING" ? "" : "-"}${a.id}`)
        .join(",")
    }
    setQueryResponse({ status: APIStatus.InProgress })
    api.data.ga
      .get(apiObject)
      .then(response => {
        setQueryResponse({
          status: APIStatus.Success,
          response: response.result,
        })
      })
      .catch(e => {
        setQueryResponse({ status: APIStatus.Error, error: e.result.error })
      })
  }, [
    view,
    startDate,
    endDate,
    selectedDimensions,
    selectedMetrics,
    selectedSegment,
    sort,
    startIndex,
    maxResults,
    filters,
    selectedSamplingValue,
    includeEmptyRows,
    api,
  ])

  return { runQuery, requiredParameters, queryResponse }
}
