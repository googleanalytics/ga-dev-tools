import { useState, useEffect, useMemo } from "react"
import { SelectableProperty } from "../../../../components/GA4PropertySelector"
import { DateRange } from "../_DateRanges"
import { GA4Dimensions, GA4Metrics } from "../../../../components/GA4Pickers"
import {
  usePersistentString,
  usePersistentBoolean,
  usePersistantObject,
} from "../../../../hooks"
import { StorageKey } from "../../../../constants"
import { FilterExpression } from "../_Filter/_index"

type OrderBy = gapi.client.analyticsdata.OrderBy

const useInputs = () => {
  const [showRequestJSON, setShowRequestJSON] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicShowRequestJSON,
    true
  )
  const [selectedProperty, setSelectedProperty] = useState<SelectableProperty>()
  const [dateRanges, setDateRanges] = usePersistantObject<DateRange[]>(
    StorageKey.ga4RequestComposerBasicDateRanges
  )
  const [dimensions, setDimensions] = useState<GA4Dimensions>()
  const [dimensionFilter, setDimensionFilter] = useState<FilterExpression>()
  const [metrics, setMetrics] = useState<GA4Metrics>()
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

  const [inputPropertyString, setInputPropertyString] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedPropertyString
  )

  const [currencyCode, setCurrencyCode] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedCurrencyCode
  )

  const propertyString = useMemo(() => `properties/${inputPropertyString}`, [
    inputPropertyString,
  ])

  const [keepEmptyRows, setKeepEmptyRows] = usePersistentBoolean(
    StorageKey.ga4RequestComposerBasicKeepEmptyRows,
    false
  )

  useEffect(() => {
    if (selectedProperty !== undefined) {
      setInputPropertyString(
        selectedProperty.property.replace(/^properties\//, "")
      )
    }
  }, [selectedProperty, setInputPropertyString])

  return {
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
    currencyCode,
    setCurrencyCode,
    keepEmptyRows,
    setKeepEmptyRows,
  }
}
export default useInputs
