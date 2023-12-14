import * as React from "react"

import { styled } from '@mui/material/styles';

import { Dispatch } from "@/types"
import { Url } from "@/constants"
import SelectMultiple, { SelectOption } from "@/components/SelectMultiple"
import ExternalLink from "@/components/ExternalLink"
import WithHelpText from "@/components/WithHelpText"

const PREFIX = 'MetricAggregations';

const classes = {
  aggregations: `${PREFIX}-aggregations`
};

const StyledWithHelpText = styled(WithHelpText)((
  {
    theme
  }
) => ({
  [`&.${classes.aggregations}`]: {
    marginTop: theme.spacing(1),
  }
}));

export enum MetricAggregation {
  Total = "TOTAL",
  Minimum = "MINIMUM",
  Maximum = "MAXIMUM",
  Count = "COUNT",
}

const totalOption = { value: MetricAggregation.Total, displayName: "total" }
const minimumOption = {
  value: MetricAggregation.Minimum,
  displayName: "minimum",
}
const maximumOption = {
  value: MetricAggregation.Maximum,
  displayName: "maximum",
}
const countOption = { value: MetricAggregation.Count, displayName: "count" }

const metricAggregationFor = (aggregation: MetricAggregation): SelectOption => {
  switch (aggregation) {
    case MetricAggregation.Total:
      return totalOption
    case MetricAggregation.Minimum:
      return minimumOption
    case MetricAggregation.Maximum:
      return maximumOption
    case MetricAggregation.Count:
      return countOption
  }
}

const metricAggregationsLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicMetricAggregations}>
    metricAggregations
  </ExternalLink>
)

const MetricAggregations: React.FC<{
  metricAggregations: MetricAggregation[] | undefined
  setMetricAggregations: Dispatch<MetricAggregation[] | undefined>
  count?: true | undefined
}> = ({ metricAggregations, setMetricAggregations, count }) => {

  const metricAggregationOptions = [
    totalOption,
    minimumOption,
    maximumOption,
  ].concat(count ? [countOption] : [])
  return (
    <StyledWithHelpText
      className={classes.aggregations}
      helpText={
        <>
          The aggregations to use for the metrics. See {metricAggregationsLink}{" "}
          on devsite.
        </>
      }
    >
      <SelectMultiple
        label="metric aggregations"
        options={metricAggregationOptions}
        onChange={e =>
          setMetricAggregations(
            e === undefined
              ? undefined
              : e.map(m => m.value as MetricAggregation)
          )
        }
        value={(metricAggregations || []).map(metricAggregationFor)}
      />
    </StyledWithHelpText>
  );
}

export default MetricAggregations
