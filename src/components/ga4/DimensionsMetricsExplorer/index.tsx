import * as React from "react"
import { useMemo } from "react"

import { Clear } from "@material-ui/icons"
import ExternalLink from "@/components/ExternalLink"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"

import { Url, StorageKey } from "@/constants"
import { usePersistentString } from "@/hooks"
import Info from "@/components/Info"
import { SAB } from "@/components/Buttons"
import Spinner from "@/components/Spinner"
import PropertyPicker from "@/components/ga4/PropertyPicker"
import Field from "./Field"
import {
  useInputs,
  useDimensionsAndMetrics,
  useScrollTo,
  RequestState,
} from "./hooks"

const adminAPI = <ExternalLink href={Url.ga4AdminAPI}>Admin API</ExternalLink>

const useStyles = makeStyles(theme => ({
  clearSearchButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.25, 0.5),
  },
}))

const DimensionsMetricsExplorer: React.FC = () => {
  const classes = useStyles()
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
  const { dimensions, metrics, state } = useDimensionsAndMetrics(propertyId)
  useScrollTo(state)

  const visibleDimensions = React.useMemo(
    () =>
      dimensions?.filter(dimension =>
        search === undefined
          ? true
          : dimension.uiName?.toLowerCase().includes(search.toLowerCase()) ||
            dimension.apiName?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, dimensions]
  )

  const visibleMetrics = React.useMemo(
    () =>
      metrics?.filter(metric =>
        search === undefined
          ? true
          : metric.uiName?.toLowerCase().includes(search.toLowerCase()) ||
            metric.apiName?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, metrics]
  )

  const notAllFields = useMemo(() => {
    if (
      visibleDimensions === undefined ||
      visibleMetrics === undefined ||
      metrics === undefined ||
      dimensions === undefined
    ) {
      return null
    }
    if (
      visibleMetrics.length !== metrics.length ||
      visibleDimensions.length !== dimensions.length
    ) {
      return (
        <Info>
          You are only viewing a subset of the available metrics and dimensions.
          <SAB
            size="small"
            className={classes.clearSearchButton}
            onClick={() => setSearch(undefined)}
          >
            Clear search
          </SAB>{" "}
          to see all fields.
        </Info>
      )
    }
  }, [
    visibleMetrics,
    visibleDimensions,
    metrics,
    dimensions,
    classes,
    setSearch,
  ])

  return (
    <>
      <section>
        <Typography>
          The {adminAPI} for GA4 allows users to see custom dimensions and
          metrics for a given property, or see dimensions and metrics that are
          shared among all GA4 properties.
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
        {notAllFields}
      </section>
      {state === RequestState.Loading ? (
        <>
          <Spinner>
            <Typography>Loading dimenions and metrics &hellip;</Typography>
          </Spinner>
        </>
      ) : (
        <>
          <Typography variant="h2">Dimensions</Typography>
          {visibleDimensions?.map(dimension => (
            <Field field={{ type: "dimension", value: dimension }} />
          ))}
          <Typography variant="h2">Metrics</Typography>
          {visibleMetrics?.map(metric => (
            <Field field={{ type: "metric", value: metric }} />
          ))}
        </>
      )}
    </>
  )
}

export default DimensionsMetricsExplorer
