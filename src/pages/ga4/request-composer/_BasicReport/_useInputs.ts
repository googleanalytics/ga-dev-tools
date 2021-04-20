import { useState, useEffect, useMemo } from "react"
import { SelectableProperty } from "../../../../components/GA4PropertySelector"
import { DateRange } from "../_DateRanges"
import { GA4Dimensions, GA4Metrics } from "../../../../components/GA4Pickers"
import { usePersistentString } from "../../../../hooks"
import { StorageKey } from "../../../../constants"

const useInputs = () => {
  const [selectedProperty, setSelectedProperty] = useState<SelectableProperty>()
  const [dateRanges, setDateRanges] = useState<DateRange[]>([])
  const [dimensions, setDimensions] = useState<GA4Dimensions>()
  const [metrics, setMetrics] = useState<GA4Metrics>()

  const [inputPropertyString, setInputPropertyString] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedPropertyString
  )

  const propertyString = useMemo(() => `properties/${inputPropertyString}`, [
    inputPropertyString,
  ])

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
  }
}
export default useInputs
