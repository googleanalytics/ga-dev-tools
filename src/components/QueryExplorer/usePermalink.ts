import { useMemo } from "react"
import { QueryParam, SortableColumn } from "."
import { BooleanParam } from "serialize-query-params"
import {
  AccountSummary,
  ProfileSummary,
  WebPropertySummary,
} from "../ViewSelector/useAccountPropertyView"
import { Column, Segment } from "@/types/ua"

type Arg = {
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
  viewID: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  selectedMetrics: Column[] | undefined
  selectedDimensions: Column[] | undefined
  sort: SortableColumn[] | undefined
  filters: string | undefined
  segment: Segment | undefined
  showSegmentDefinition: boolean | undefined
  startIndex: string | undefined
  maxResults: string | undefined
  includeEmptyRows: boolean | undefined
}

const usePermalink = ({
  account,
  property,
  view,
  viewID,
  startDate,
  endDate,
  selectedMetrics,
  selectedDimensions,
  sort,
  filters,
  segment,
  showSegmentDefinition,
  startIndex,
  maxResults,
  includeEmptyRows,
}: Arg) => {
  return useMemo(() => {
    const urlParams = new URLSearchParams()

    if (account !== undefined) {
      urlParams.append(QueryParam.Account, account.id!)
    }

    if (property !== undefined) {
      urlParams.append(QueryParam.Property, property.id!)
    }

    if (view !== undefined) {
      urlParams.append(QueryParam.View, view.id!)
    }

    if (viewID !== undefined) {
      urlParams.append(QueryParam.ViewID, viewID)
    }

    if (startDate !== undefined) {
      urlParams.append(QueryParam.StartDate, startDate)
    }

    if (endDate !== undefined) {
      urlParams.append(QueryParam.EndDate, endDate)
    }

    if (selectedMetrics !== undefined) {
      urlParams.append(
        QueryParam.SelectedMetrics,
        selectedMetrics.map(c => c.id).join(",")
      )
    }

    if (selectedDimensions !== undefined) {
      urlParams.append(
        QueryParam.SelectedDimensions,
        selectedDimensions.map(c => c.id).join(",")
      )
    }

    if (sort !== undefined) {
      urlParams.append(
        QueryParam.Sort,
        sort.map(s => `${s.sort === "DESCENDING" ? "-" : ""}${s.id}`).join(",")
      )
    }

    if (filters !== undefined) {
      urlParams.append(QueryParam.Filters, filters)
    }

    if (segment !== undefined) {
      urlParams.append(QueryParam.Segment, segment.id!)
    }

    if (showSegmentDefinition !== undefined) {
      urlParams.append(
        QueryParam.ShowSegmentDefinitions,
        BooleanParam.encode(showSegmentDefinition) as string
      )
    }

    if (startIndex !== undefined) {
      urlParams.append(QueryParam.StartIndex, startIndex)
    }

    if (maxResults !== undefined) {
      urlParams.append(QueryParam.MaxResults, maxResults)
    }

    if (includeEmptyRows !== undefined) {
      urlParams.append(
        QueryParam.IncludeEmptyRows,
        BooleanParam.encode(includeEmptyRows) as string
      )
    }

    const { protocol, host, pathname } = window.location
    return `${protocol}//${host}${pathname}?${urlParams}`
  }, [
    account,
    property,
    view,
    viewID,
    startDate,
    endDate,
    selectedMetrics,
    selectedDimensions,
    sort,
    filters,
    segment,
    showSegmentDefinition,
    startIndex,
    maxResults,
    includeEmptyRows,
  ])
}
export default usePermalink
