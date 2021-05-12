import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"

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

const useStyles = makeStyles(theme => ({
  expressions: {
    "&> *": {
      marginBottom: theme.spacing(3),
    },
  },
  buttons: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

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
  const classes = useStyles()

  return (
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
  )
}

export default ExpressionList
