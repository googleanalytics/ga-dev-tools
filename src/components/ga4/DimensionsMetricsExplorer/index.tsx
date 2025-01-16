import * as React from "react"

import {Link} from "gatsby"

import {styled} from '@mui/material/styles';
import Typography from "@mui/material/Typography"
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import {Button, InputLabel, Select, SelectChangeEvent} from '@mui/material';

import ExternalLink from "@/components/ExternalLink"
import {StorageKey, Url} from "@/constants"
import {useScrollTo} from "@/hooks"
import Loadable from "@/components/Loadable"
import ScrollToTop from "@/components/ScrollToTop"

import Field from "./Field"
import {Dimension, Metric, Successful, useDimensionsAndMetrics,} from "./useDimensionsAndMetrics"
import StreamPicker from "../StreamPicker"
import useAccountProperty, {AccountProperty} from "../StreamPicker/useAccountProperty"
import useCompatibility from "./useCompatibility"
import Compatible from "./Compatible"

const PREFIX = 'DimensionsMetricsExplorer';

const classes = {
  headingLinks: `${PREFIX}-headingLinks`,
  form: `${PREFIX}-form`,
  search: `${PREFIX}-search`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.headingLinks}`]: {
    "& > a": {
      color: theme.palette.text.primary,
    },
  },

  [`& .${classes.search}`]: {
    marginTop: theme.spacing(1),
  },

  [`& .${classes.form}`]: {
    maxWidth: "80ch",
  }
}));

const dataAPI = (
  <ExternalLink href={Url.ga4DataAPIGetMetadata}>
    GA4 Data API's getMetadata method
  </ExternalLink>
)

const RenderSuccessful: React.FC<Successful & { aps: AccountProperty }> = ({
                                                                             categories,
                                                                             metrics,
                                                                             dimensions,
                                                                             aps,
                                                                           }) => {

  type ViewMode = 'all' | 'compatible' | 'incompatible'
  const [viewMode, setViewMode] = React.useState<ViewMode>('all')

  const compatibility = useCompatibility(aps)

  useScrollTo()
  const handleViewModeChange = (event: SelectChangeEvent) => {
    setViewMode(event.target.value as ViewMode);
  };

  const fieldDisplayFilter = React.useCallback(
      (c: Dimension | Metric) => {
        const isCompatible = compatibility.incompatibleDimensions?.find(d =>
                d.apiName === c.apiName) === undefined &&
            compatibility.incompatibleMetrics?.find(d =>
                d.apiName === c.apiName) === undefined
        return viewMode === 'all' || (viewMode === 'compatible' &&
            isCompatible) || (viewMode === 'incompatible' && !isCompatible);
      },
      [viewMode,
        compatibility.incompatibleDimensions,
        compatibility.incompatibleMetrics]
  )

  const filteredCategories = React.useMemo(
      () =>
          categories.map(c => ({
            ...c,
            dimensions: c.dimensions.filter(fieldDisplayFilter),
            metrics: c.metrics.filter(fieldDisplayFilter),
          })),
      [categories, fieldDisplayFilter]
  )

  const resetAllCategoryAccordions = (expanded: boolean) =>
  {
    const initialCategoryAccordionState = {} as any
    categories.forEach( (x) => initialCategoryAccordionState[x.category]=expanded )
    return initialCategoryAccordionState
  }

  const [categoryAccordionState,
    setCategoryAccordionState] = React.useState(resetAllCategoryAccordions(true));

  const handleCategoryAccordionStateChange =
      (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        const newState = {
          ...categoryAccordionState
        }
        newState[category] = isExpanded
        setCategoryAccordionState(newState);
      };

  return (
      (<Root>
        <Compatible allDimensions={dimensions} allMetrics={metrics}
                    property={aps.property} {...compatibility}  />

        <FormControl sx={{m: 1, minWidth: 120}} size="small">
          <InputLabel>View mode</InputLabel>
          <Select
              value={viewMode}
              onChange={handleViewModeChange}
              label="Show fields"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="compatible">Compatible only</MenuItem>
            <MenuItem value="incompatible">Incompatible only</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h3">
          Dimensions & Metrics
        </Typography>

        <Button
            onClick={() => {
              setCategoryAccordionState(resetAllCategoryAccordions(true))
            }}
        >
          Expand all
        </Button>
        <Button
            onClick={() => {
              setCategoryAccordionState(resetAllCategoryAccordions(false))
            }}
        >
          Collapse all
        </Button>

        {filteredCategories.map(({category, dimensions, metrics}) => {
          if (dimensions.length === 0 && metrics.length === 0) {
            return null
          }
          const baseAnchor = encodeURIComponent(category)
          return (
              <React.Fragment key={category}>
                <Accordion expanded={categoryAccordionState[category]}
                           onChange={handleCategoryAccordionStateChange(category)}>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon/>}
                  >
                    <Typography
                        variant="h2"
                        id={baseAnchor}
                        className={classes.headingLinks}
                    >
                      <Link to={`#${baseAnchor}`}>{category}</Link>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {dimensions.length > 0 && (
                        <>
                          <Typography
                              variant="h3"
                              id={`${baseAnchor}_dimensions`}
                              className={classes.headingLinks}
                          >
                            <Link
                                to={`#${baseAnchor}_dimensions`}>Dimensions</Link>
                          </Typography>
                          {dimensions.map(dimension => (
                              <Field
                                  {...compatibility}
                                  {...aps}
                                  key={dimension.apiName}
                                  field={{type: "dimension", value: dimension}}
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
                                  {...compatibility}
                                  {...aps}
                                  key={metric.apiName}
                                  field={{type: "metric", value: metric}}
                              />
                          ))}
                        </>
                    )}
                  </AccordionDetails>
                </Accordion>
              </React.Fragment>
          )
      })}
    </Root>)
  );
}

export enum QueryParam {
  Account = "a",
  Property = "b",
  Stream = "c",
}

const DimensionsMetricsExplorer: React.FC = () => {
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
        <section className={classes.form}>
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
