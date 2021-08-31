import { useState, useCallback } from "react"

import {
  usePersistentString,
  usePersistentBoolean,
  usePersistantObject,
} from "@/hooks"
import { StorageKey } from "@/constants"
import useAvailableColumns from "@/components/GA4Pickers/useAvailableColumns"
import { DateRange } from "../DateRanges"
import { FilterExpression } from "../Filter"
import { MetricAggregation } from "../MetricAggregations"
import { useKeyedHydratedPersistantArray } from "@/hooks/useHydrated"
import { QueryParam } from "."
import { DimensionsAndMetricsRequest } from "../../DimensionsMetricsExplorer/useDimensionsAndMetrics"
import { RequestStatus } from "@/types"

type OrderBy = gapi.client.analyticsdata.OrderBy
type CohortSpec = gapi.client.analyticsdata.CohortSpec

const useInputs = (
  dimensionsAndMetricsRequest: DimensionsAndMetricsRequest
) => {
  const [showRequestJSON, setShowRequestJSON] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicShowRequestJSON,
    true
  )
  const [dateRanges, setDateRanges] = usePersistantObject<DateRange[]>(
    StorageKey.ga4RequestComposerBasicDateRanges
  )

  const getDimensionsByIDs = useCallback(
    (ids: string[] | undefined) => {
      if (
        ids === undefined ||
        dimensionsAndMetricsRequest.status !== RequestStatus.Successful
      ) {
        return undefined
      }
      return dimensionsAndMetricsRequest.dimensions.filter(m =>
        ids.includes(m.apiName!)
      )
    },
    [dimensionsAndMetricsRequest]
  )

  const [dimensions, setDimensionIDs] = useKeyedHydratedPersistantArray(
    StorageKey.ga4RequestComposerBasicSelectedDimensions,
    QueryParam.Dimensions,
    getDimensionsByIDs
  )

  const [dimensionFilter, setDimensionFilter] = useState<FilterExpression>()

  const getMetricsByIDs = useCallback(
    (ids: string[] | undefined) => {
      if (
        ids === undefined ||
        dimensionsAndMetricsRequest.status !== RequestStatus.Successful
      ) {
        return undefined
      }
      return dimensionsAndMetricsRequest.metrics.filter(m =>
        ids.includes(m.apiName!)
      )
    },
    [dimensionsAndMetricsRequest]
  )

  const [metrics, setMetricIDs] = useKeyedHydratedPersistantArray(
    StorageKey.ga4RequestComposerBasicSelectedMetrics,
    QueryParam.Metrics,
    getMetricsByIDs
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
    request: dimensionsAndMetricsRequest,
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
    setDimensionIDs((old = []) => old.concat([firstSessionDate.apiName!]))
  }, [setDimensionIDs, dimensionOptions])

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
    setDimensionIDs,
    metrics,
    setMetricIDs,
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
