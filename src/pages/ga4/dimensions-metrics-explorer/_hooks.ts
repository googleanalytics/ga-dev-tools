import { useSelector } from "react-redux"
import { useMemo, useEffect } from "react"
import { usePersistantObject, usePersistentString } from "../../../hooks"
import { StorageKey } from "../../../constants"

export const useInputs = () => {
  const [search, setSearch] = usePersistentString(
    StorageKey.ga4DimensionsMetricsSearch
  )

  return { search, setSearch }
}

type Dimension = gapi.client.analyticsdata.DimensionMetadata
type Metric = gapi.client.analyticsdata.MetricMetadata

type UseDimensionsAndMetrics = (
  propertyId: string
) => { dimensions: Dimension[] | undefined; metrics: Metric[] | undefined }
export const useDimensionsAndMetrics: UseDimensionsAndMetrics = property => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = useMemo(() => gapi?.client.analyticsdata, [gapi])
  const [fields, setFields] = usePersistantObject<{
    [key: string]: {
      dimensions: Dimension[] | undefined
      metrics: Metric[] | undefined
    }
  }>(StorageKey.ga4DimensionsMetricsFields)

  useEffect(() => {
    if (dataAPI === undefined) {
      return
    }
    dataAPI.properties
      .getMetadata({ name: `properties/${property}/metadata` })
      .then(response => {
        const { name, dimensions, metrics } = response.result
        setFields(old => {
          const nu = { dimensions, metrics }
          const existing = old?.[property]
          if (
            existing !== undefined &&
            JSON.stringify(existing) === JSON.stringify(nu)
          ) {
            return old
          } else {
            return { ...(old || {}), [property]: { dimensions, metrics } }
          }
        })
        console.log({ name, dimensions, metrics, result: response.result })
      })
  }, [dataAPI, setFields, property])

  const dimensions = useMemo(() => fields?.[property]?.dimensions, [
    fields,
    property,
  ])

  const metrics = useMemo(() => fields?.[property]?.metrics, [fields, property])

  return { dimensions, metrics }
}
