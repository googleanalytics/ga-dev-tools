import { useState, useCallback } from "react"

import {
  usePersistentString,
  usePersistentBoolean,
  usePersistantObject,
} from "@/hooks"
import { StorageKey } from "@/constants"
import { GA4Dimensions, GA4Metrics } from "@/components/GA4Pickers"
import useAvailableColumns from "@/components/GA4Pickers/useAvailableColumns"
import { DateRange } from "../DateRanges"
import { FilterExpression } from "../Filter"
import { MetricAggregation } from "../MetricAggregations"
import { AccountProperty } from "../../StreamPicker/useAccountProperty"

type OrderBy = gapi.client.analyticsdata.OrderBy
type CohortSpec = gapi.client.analyticsdata.CohortSpec

const useInputs = (aps: AccountProperty) => {
  const [showRequestJSON, setShowRequestJSON] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicShowRequestJSON,
    true
  )
  const [dateRanges, setDateRanges] = usePersistantObject<DateRange[]>(
    StorageKey.ga4RequestComposerBasicDateRanges
  )
  const [dimensions, setDimensions] = usePersistantObject<
    NonNullable<GA4Dimensions>
  >(StorageKey.ga4RequestComposerBasicSelectedDimensions)
  const [dimensionFilter, setDimensionFilter] = useState<FilterExpression>()
  const [metrics, setMetrics] = usePersistantObject<NonNullable<GA4Metrics>>(
    StorageKey.ga4RequestComposerBasicSelectedMetrics
  )
  const [metricFilter, setMetricFilter] = useState<FilterExpression>()
  const [offset, setOffset] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedOffset
  )
  const [limit, setLimit] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedLimit
  )

  const [orderBys, setOrderBys] = usePersistantObject<OrderBy[]>(
    StorageKey.ga4RequestComposerBasicOrderBys
  )

  const [showAdvanced, setShowAdvanced] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicShowAdvanced,
    false
  )

  const [metricAggregations, setMetricAggregations] = usePersistantObject<
    MetricAggregation[]
  >(StorageKey.ga4RequestComposerBasicMetricAggregations)

  const { dimensionOptions } = useAvailableColumns({
    selectedMetrics: metrics,
    selectedDimensions: dimensions,
    aps,
  })

  const [cohortSpec, setCohortSpec] = usePersistantObject<CohortSpec>(
    StorageKey.ga4RequestComposerBasicCohortSpec
  )

  const [keepEmptyRows, setKeepEmptyRows] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicKeepEmptyRows,
    false
  )

  const addFirstSessionDate = useCallback(() => {
    const firstSessionDate = dimensionOptions?.find(
      dim => dim.apiName === "firstSessionDate"
    )
    if (firstSessionDate === undefined) {
      return
    }
    setDimensions((old = []) => old.concat([firstSessionDate]))
  }, [setDimensions, dimensionOptions])

  const removeDateRanges = useCallback(() => {
    setDateRanges(undefined)
  }, [setDateRanges])

  return {
    metricAggregations,
    showAdvanced,
    setShowAdvanced,
    setMetricAggregations,
    addFirstSessionDate,
    dateRanges,
    setDateRanges,
    dimensions,
    setDimensions,
    metrics,
    setMetrics,
    showRequestJSON,
    setShowRequestJSON,
    dimensionFilter,
    setDimensionFilter,
    metricFilter,
    setMetricFilter,
    offset,
    setOffset,
    limit,
    setLimit,
    removeDateRanges,
    orderBys,
    setOrderBys,
    keepEmptyRows,
    setKeepEmptyRows,
    cohortSpec,
    setCohortSpec,
  }
}
export default useInputs
