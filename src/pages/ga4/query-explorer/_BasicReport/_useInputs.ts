import { useState, useEffect, useMemo, useCallback } from "react"
import { SelectableProperty } from "../../../../components/GA4PropertySelector"
import { DateRange } from "../_DateRanges"
import {
  GA4Dimensions,
  GA4Metrics,
  useAvailableColumns,
} from "../../../../components/GA4Pickers"
import {
  usePersistentString,
  usePersistentBoolean,
  usePersistantObject,
} from "../../../../hooks"
import { StorageKey } from "../../../../constants"
import { FilterExpression } from "../_Filter/_index"
import { MetricAggregation } from "../_MetricAggregations"

type OrderBy = gapi.client.analyticsdata.OrderBy
type CohortSpec = gapi.client.analyticsdata.CohortSpec

const useInputs = () => {
  const [showRequestJSON, setShowRequestJSON] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicShowRequestJSON,
    true
  )
  const [selectedProperty, setSelectedProperty] = useState<SelectableProperty>()
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

  const [metricAggregations, setMetricAggregations] = usePersistantObject<
    MetricAggregation[]
  >(StorageKey.ga4RequestComposerBasicMetricAggregations)

  const [inputPropertyString, setInputPropertyString] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedPropertyString
  )

  const propertyString = useMemo(() => `properties/${inputPropertyString}`, [
    inputPropertyString,
  ])

  const { dimensionOptions } = useAvailableColumns({
    selectedMetrics: metrics,
    selectedDimensions: dimensions,
    property: propertyString,
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

  useEffect(() => {
    if (selectedProperty !== undefined) {
      setInputPropertyString(
        selectedProperty.property.replace(/^properties\//, "")
      )
    }
  }, [selectedProperty, setInputPropertyString])

  return {
    metricAggregations,
    setMetricAggregations,
    addFirstSessionDate,
    selectedProperty,
    setSelectedProperty,
    inputPropertyString,
    propertyString,
    setInputPropertyString,
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
    orderBys,
    setOrderBys,
    keepEmptyRows,
    setKeepEmptyRows,
    cohortSpec,
    setCohortSpec,
  }
}
export default useInputs
