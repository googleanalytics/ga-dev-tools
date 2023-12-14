import * as React from "react"

import { styled } from '@mui/material/styles';

import { GA4Dimension, GA4Metric } from "@/components/GA4Pickers"
import {
  FilterExpressionList,
  UpdateFilterFn,
  FilterType,
  AddExpressionFn,
  RemoveExpressionFn,
  ExpressionPath,
} from "./index"
import Expression, { AddExpression, RemoveExpression } from "./Expression"
import WithHelpText from "@/components/WithHelpText"

const PREFIX = 'ExpressionList';

const classes = {
  expressions: `${PREFIX}-expressions`,
  buttons: `${PREFIX}-buttons`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.expressions}`]: {
    "&> *": {
      marginBottom: theme.spacing(3),
    },
  },

  [`& .${classes.buttons}`]: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  }
}));

const ExpressionList: React.FC<{
  type: FilterType
  expressionList: FilterExpressionList
  nesting: number
  variant: "and" | "or"
  path: ExpressionPath
  addExpression: AddExpressionFn
  removeExpression: RemoveExpressionFn
  updateFilter: UpdateFilterFn
  dimensionFilter: (dim: GA4Dimension) => boolean
  metricFilter: (dim: GA4Metric) => boolean
}> = ({
  type,
  expressionList,
  nesting,
  variant,
  path,
  addExpression,
  removeExpression,
  dimensionFilter,
  metricFilter,
  updateFilter,
}) => {


  return (
      <Root>
        <WithHelpText hrGroup label={variant.toUpperCase()}>
          <section className={classes.expressions}>
            {expressionList.expressions?.map((expression, idx) => (
              <Expression
                type={type}
                updateFilter={updateFilter}
                metricFilter={metricFilter}
                dimensionFilter={dimensionFilter}
                path={path.concat(["expressions", idx])}
                addExpression={addExpression}
                removeExpression={removeExpression}
                key={`${variant}-${nesting}-${idx}`}
                expression={expression}
                nesting={nesting + 1}
              />
            ))}
          </section>
          <section className={classes.buttons}>
            <AddExpression
              path={path.concat([
                "expressions",
                expressionList.expressions!.length,
              ])}
              addExpression={addExpression}
            />

            <RemoveExpression
              path={path}
              removeExpression={removeExpression}
              label={variant}
            />
          </section>
        </WithHelpText>
      </Root>
  );
}

export default ExpressionList
