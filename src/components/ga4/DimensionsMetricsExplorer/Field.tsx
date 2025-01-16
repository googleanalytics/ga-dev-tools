import * as React from "react"

import {styled} from '@mui/material/styles';

import IconLink from "@mui/icons-material/Link"
import Typography from "@mui/material/Typography"

import InlineCode from "@/components/InlineCode"
import {CopyIconButton} from "@/components/CopyButton"
import ExternalLink from "@/components/ExternalLink"
import {Dimension, Metric} from "./useDimensionsAndMetrics"
import {QueryParam} from "."
import {AccountSummary, PropertySummary} from "@/types/ga4/StreamPicker"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import {CompatibleHook} from "./useCompatibility"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const PREFIX = 'Field';

const classes = {
  headingUIName: `${PREFIX}-headingUIName`,
  heading: `${PREFIX}-heading`,
  apiName: `${PREFIX}-apiName`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.headingUIName}`]: {
    marginRight: theme.spacing(1),
    "& > span": {
      fontSize: "inherit",
    },
  },

  [`& .${classes.heading}`]: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    "&> button": {
      display: "none",
    },
    "&:hover": {
      "&> button": {
        display: "unset",
        padding: "unset",
      },
    },
  },

  [`& .${classes.apiName}`]: {
    margin: theme.spacing(0, 1),
    fontSize: "0.75em",
  }
}));

interface FieldProps extends CompatibleHook {
  field:
    | { type: "dimension"; value: Dimension }
    | { type: "metric"; value: Metric }
  account: AccountSummary | undefined
  property: PropertySummary | undefined
}

const Field: React.FC<FieldProps> = props => {

  const {
    field,
    account,
    property,
    incompatibleDimensions,
    incompatibleMetrics,
    dimensions,
    metrics,
    addMetric,
    addDimension,
    removeMetric,
    removeDimension,
  } = props
  const apiName = field.value.apiName || ""
  const uiName = field.value.uiName || ""
  const description = field.value.description || ""

  const link = React.useMemo(() => {
    let baseURL = `${window.location.origin}${window.location.pathname}`
    let search = ``
    if (field.value.customDefinition && account && property) {
      let urlParams = new URLSearchParams()
      urlParams.append(QueryParam.Account, account.name!)
      urlParams.append(QueryParam.Property, property.property!)
      search = `?${urlParams.toString()}`
    }
    return `${baseURL}${search}#${apiName}`
  }, [field, apiName, account, property])

  const isCompatible = React.useMemo(() => {
    return (
      incompatibleDimensions?.find(d => d.apiName === field.value.apiName) ===
        undefined &&
      incompatibleMetrics?.find(m => m.apiName === field.value.apiName) ===
        undefined
    )
  }, [incompatibleMetrics, incompatibleDimensions, field.value.apiName])

  const checked = React.useMemo(
    () =>
      dimensions?.find(d => d.apiName === field.value.apiName) !== undefined ||
      metrics?.find(m => m.apiName === field.value.apiName) !== undefined,
    [dimensions, metrics, field.value.apiName]
  )

  const onChange = React.useCallback(() => {
    if (checked) {
      field.type === "metric"
        ? removeMetric(field.value)
        : removeDimension(field.value)
    } else {
      field.type === "metric"
        ? addMetric(field.value)
        : addDimension(field.value)
    }
  }, [checked, addDimension, addMetric, removeDimension, removeMetric, field])

  return (
      <>
        {
          <Root id={apiName} key={apiName}>
            <Typography variant="h4" className={classes.heading}>
              {property === undefined ? (
                  uiName
              ) : (
                  <LabeledCheckbox
                      className={classes.headingUIName}
                      checked={checked}
                      onChange={onChange}
                      disabled={!isCompatible}
                  >
                    {uiName}
                  </LabeledCheckbox>
              )}
              <InlineCode className={classes.apiName}>{apiName}</InlineCode>
              <CopyIconButton
                  icon={<IconLink color="primary"/>}
                  toCopy={link}
                  tooltipText={`Copy link to ${apiName}`}
              />
            </Typography>
            <Typography><Markdown
                remarkPlugins={[remarkGfm]}>{description}</Markdown></Typography>
          </Root>
        }
      </>
  );
}

export default Field
