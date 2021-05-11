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

const useStyles = makeStyles(theme => ({
  expressionList: {
    "&> *:not(:last-child)": {
      marginBottom: theme.spacing(1),
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
    <section className={classes.expressionList}>
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
    </section>
  )
}

export default ExpressionList
