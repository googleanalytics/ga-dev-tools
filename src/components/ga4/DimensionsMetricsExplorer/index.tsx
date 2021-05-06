import * as React from "react"
import { useMemo } from "react"

import ExternalLink from "@/components/ExternalLink"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import Clear from "@material-ui/icons/Clear"

import { Url, StorageKey } from "@/constants"
import { usePersistentString, useScrollTo } from "@/hooks"
import Loadable from "@/components/Loadable"
import Info from "@/components/Info"
import PropertyPicker from "@/components/ga4/PropertyPicker"
import Field from "./Field"
import useInputs from "./useInputs"
import { useDimensionsAndMetrics, Successful } from "./useDimensionsAndMetrics"

const dataAPI = (
  <ExternalLink href={Url.ga4DataAPIGetMetadata}>
    GA4 Data API's getMetadata method
  </ExternalLink>
)

const RenderSuccessful: React.FC<
  Successful & { search: string | undefined }
> = ({ dimensions, metrics, search }) => {
  const visibleDimensions = React.useMemo(
    () =>
      dimensions.filter(dimension =>
        search === undefined
          ? true
          : dimension.uiName?.toLowerCase().includes(search.toLowerCase()) ||
            dimension.apiName?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, dimensions]
  )

  const visibleMetrics = React.useMemo(
    () =>
      metrics.filter(metric =>
        search === undefined
          ? true
          : metric.uiName?.toLowerCase().includes(search.toLowerCase()) ||
            metric.apiName?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, metrics]
  )

  const notAllFields = useMemo(() => {
    if (
      visibleMetrics.length !== metrics.length ||
      visibleDimensions.length !== dimensions.length
    ) {
      return (
        <Info>
          You are only viewing a subset of the available metrics and dimensions.
        </Info>
      )
    }
  }, [visibleMetrics, visibleDimensions, metrics, dimensions])

  useScrollTo()

  return (
    <>
      {notAllFields}
      <Typography variant="h2">Dimensions</Typography>
      {visibleDimensions?.map(dimension => (
        <Field
          key={dimension.apiName}
          field={{ type: "dimension", value: dimension }}
        />
      ))}
      <Typography variant="h2">Metrics</Typography>
      {visibleMetrics?.map(metric => (
        <Field key={metric.apiName} field={{ type: "metric", value: metric }} />
      ))}
    </>
  )
}

const DimensionsMetricsExplorer: React.FC = () => {
  const { search, setSearch } = useInputs()
  const [selectedProperty, setSelectedProperty] = usePersistentString(
    StorageKey.ga4DimensionsMetricsSelectedProperty
  )
  const propertyId = useMemo(() => {
    if (selectedProperty === undefined) {
      return "0"
    } else {
      return selectedProperty.substring("properties/".length)
    }
  }, [selectedProperty])
  const request = useDimensionsAndMetrics(propertyId)

  return (
    <>
      <section>
        <Typography>
          The {dataAPI} allows users to see query dimensions and metrics
          (including custom ones) for a given property.
        </Typography>
        <Typography>
          This demo is a catalog of all dimensions and metrics available for a
          given property. It includes linkable descriptions of all fields.
        </Typography>
        <PropertyPicker
          setPropertyId={setSelectedProperty}
          propertyId={selectedProperty}
        />
        <TextField
          label="Search for a dimension or metric"
          variant="outlined"
          fullWidth
          size="small"
          value={search || ""}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton size="small" onClick={() => setSearch("")}>
                <Clear />
              </IconButton>
            ),
          }}
        />
        <Loadable
          request={request}
          renderSuccessful={s => <RenderSuccessful {...s} search={search} />}
          inProgressText="Loading dimensions and metrics"
        />
      </section>
    </>
  )
}

export default DimensionsMetricsExplorer
