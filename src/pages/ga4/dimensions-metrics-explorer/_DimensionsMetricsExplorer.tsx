import * as React from "react"
import { useDimensionsAndMetrics, useInputs, RequestState } from "./_hooks"
import {
  Typography,
  TextField,
  IconButton,
  makeStyles,
} from "@material-ui/core"
import InlineCode from "../../../components/InlineCode"
import { Clear } from "@material-ui/icons"
import GA4PropertySelector, {
  SelectableProperty,
} from "../../../components/GA4PropertySelector"
import { StorageKey, Url } from "../../../constants"
import { CopyIconButton } from "../../../components/CopyButton"
import { SAB } from "../../../components/Buttons"
import { useMemo, useState } from "react"
import Info from "../../../components/Info"
import Spinner from "../../../components/Spinner"

const adminAPI = <a href={Url.ga4AdminAPI}>Admin API</a>

const useStyles = makeStyles(theme => ({
  clearSearchButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.25, 0.5),
  },
}))

const DimensionsMetricsExplorer: React.FC = () => {
  const classes = useStyles()
  const { search, setSearch } = useInputs()
  const [selectedProperty, setSelectedProperty] = useState<SelectableProperty>()
  const propertyId = useMemo(() => {
    if (selectedProperty === undefined) {
      return "0"
    } else {
      return selectedProperty.property.substring("properties/".length)
    }
  }, [selectedProperty])
  const { dimensions, metrics, state } = useDimensionsAndMetrics(propertyId)

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
          given property. It includes linkable descriptions of all fields and
          can optionally show custom dimensions and metrics if you login.
        </Typography>
        <GA4PropertySelector
          setSelectedProperty={setSelectedProperty}
          accountSummariesKey={StorageKey.ga4DimensionsMetricsAccountSummaries}
          selectedAccountKey={StorageKey.ga4DimensionsMetricsSelectedAccount}
          selectedPropertyKey={StorageKey.ga4DimensionsMetricsSelectedProperty}
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
                <Clear />{" "}
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
            <div key={dimension.apiName}>
              <Typography variant="h3">
                {dimension.uiName} <InlineCode>{dimension.apiName}</InlineCode>
                <CopyIconButton
                  tooltipText="Copy api name"
                  toCopy={dimension.apiName || ""}
                />
              </Typography>
              <Typography>{dimension.description}</Typography>
            </div>
          ))}
          <Typography variant="h2">Metrics</Typography>
          {visibleMetrics?.map(metric => (
            <div key={metric.apiName}>
              <Typography variant="h3">
                {metric.uiName} <InlineCode>{metric.apiName}</InlineCode>
              </Typography>
              <Typography>{metric.description}</Typography>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default DimensionsMetricsExplorer
