import * as React from "react"
import { useMemo } from "react"

import ExternalLink from "@/components/ExternalLink"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import Clear from "@material-ui/icons/Clear"

import { Url, StorageKey } from "@/constants"
import { useScrollTo } from "@/hooks"
import Loadable from "@/components/Loadable"
import Info from "@/components/Info"
import Field from "./Field"
import useInputs from "./useInputs"
import {
  useDimensionsAndMetrics,
  Successful,
  Dimension,
  Metric,
} from "./useDimensionsAndMetrics"
import useFormStyles from "@/hooks/useFormStyles"
import StreamPicker from "../StreamPicker"
import useAccountProperty, {
  AccountProperty,
} from "../StreamPicker/useAccountProperty"
import { Link } from "gatsby"
import { makeStyles } from "@material-ui/core"
import useCompatibility from "./useCompatibility"
import Compatible from "./Compatible"
import ScrollToTop from "@/components/ScrollToTop"

const dataAPI = (
  <ExternalLink href={Url.ga4DataAPIGetMetadata}>
    GA4 Data API's getMetadata method
  </ExternalLink>
)

// TODO - add back in once this api is public.
// const checkCompatibility = (
//   <ExternalLink href="#todo">checkCompatibility</ExternalLink>
// )

const useStyles = makeStyles(theme => ({
  headingLinks: {
    "& > a": {
      color: theme.palette.text.primary,
    },
  },
  search: {
    marginTop: theme.spacing(1),
  },
}))

const RenderSuccessful: React.FC<Successful & { aps: AccountProperty }> = ({
  categories,
  aps,
}) => {
  const classes = useStyles()
  const { search, setSearch } = useInputs()
  const searchRegex = useMemo(
    () =>
      search
        ? new RegExp(
            // Escape all "special" regex characters. We're only creating a regex
            // here to make the testing code more simple.
            search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
            "gi"
          )
        : undefined,
    [search]
  )

  const compability = useCompatibility(aps)

  const searchFilter = React.useCallback(
    (c: Dimension | Metric) => {
      if (searchRegex === undefined) {
        return true
      }
      return searchRegex.test(c.uiName!) || searchRegex.test(c.apiName!)
    },
    [searchRegex]
  )

  const filteredCategories = React.useMemo(
    () =>
      categories.map(c => ({
        ...c,
        dimensions: c.dimensions.filter(searchFilter),
        metrics: c.metrics.filter(searchFilter),
      })),
    [searchFilter, categories]
  )

  const notAllFields = useMemo(() => {
    if (searchRegex !== undefined) {
      return (
        <Info>
          You are only viewing a subset of the available metrics and dimensions.
        </Info>
      )
    }
  }, [searchRegex])

  useScrollTo()

  return (
    <>
      <Compatible property={aps.property} {...compability} />
      <TextField
        className={classes.search}
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
      {filteredCategories.map(({ category, dimensions, metrics }) => {
        if (dimensions.length === 0 && metrics.length === 0) {
          return null
        }
        const baseAnchor = encodeURIComponent(category)
        return (
          <React.Fragment key={category}>
            <Typography
              variant="h2"
              id={baseAnchor}
              className={classes.headingLinks}
            >
              <Link to={`#${baseAnchor}`}>{category}</Link>
            </Typography>
            {dimensions.length > 0 && (
              <>
                <Typography
                  variant="h3"
                  id={`${baseAnchor}_dimensions`}
                  className={classes.headingLinks}
                >
                  <Link to={`#${baseAnchor}_dimensions`}>Dimensions</Link>
                </Typography>
                {dimensions.map(dimension => (
                  <Field
                    {...compability}
                    {...aps}
                    key={dimension.apiName}
                    field={{ type: "dimension", value: dimension }}
                  />
                ))}
              </>
            )}
            {metrics.length > 0 && (
              <>
                <Typography
                  variant="h3"
                  id={`${baseAnchor}_metrics`}
                  className={classes.headingLinks}
                >
                  <Link to={`#${baseAnchor}_metrics`}>Metrics</Link>
                </Typography>
                {metrics.map(metric => (
                  <Field
                    {...compability}
                    {...aps}
                    key={metric.apiName}
                    field={{ type: "metric", value: metric }}
                  />
                ))}
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

export enum QueryParam {
  Account = "a",
  Property = "b",
  Stream = "c",
}

const DimensionsMetricsExplorer: React.FC = () => {
  const formClasses = useFormStyles()
  const aps = useAccountProperty(
    StorageKey.ga4DimensionsMetricsExplorerAPS,
    QueryParam,
    true
  )
  const request = useDimensionsAndMetrics(aps)

  // TODO - add in once endpoint is public.
  // <Typography>
  //   If you choose an Account and Property, this demo also uses the{" "}
  //   {checkCompatibility} API so you can see which dimensions and metrics
  //   are compatible with each other. As you add fields to the request,
  //   incompatible fields will be grayed out.
  // </Typography>

  return (
    <>
      <section>
        <ScrollToTop />
        <Typography>
          The {dataAPI} allows users to see query dimensions and metrics
          (including custom ones) for a given property.
        </Typography>
        <Typography>
          This demo is a catalog of all dimensions and metrics available for a
          given property with linkable descriptions for all fields.
        </Typography>
        <section className={formClasses.form}>
          <Typography variant="h3">Select property</Typography>
          <StreamPicker autoFill {...aps} />
        </section>
        <Loadable
          request={request}
          renderSuccessful={s => <RenderSuccessful {...s} aps={aps} />}
          inProgressText="Loading dimensions and metrics"
        />
      </section>
    </>
  )
}

export default DimensionsMetricsExplorer
