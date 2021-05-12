import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"

import { PlainButton, SAB } from "@/components/Buttons"
import { GA4Dimension, GA4Metric } from "@/components/GA4Pickers"
import Filter from "./Filter"
import {
  FilterExpression,
  UpdateFilterFn,
  FilterType,
  ExpressionPath,
  AddExpressionFn,
  RemoveExpressionFn,
} from "./index"
import ExpressionList from "./ExpressionList"
import WithHelpText from "@/components/WithHelpText"

const useStyles = makeStyles(theme => ({
  not: {
    "&> *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
  label: {
    margin: theme.spacing(0),
  },
  childrenGroup: {
    display: "flex",
  },
  vrhr: {
    margin: "unset",
    marginLeft: theme.spacing(1),
  },
  children: {
    flexGrow: 1,
    "& > :first-child": {
      paddingTop: theme.spacing(1),
    },
    "& > section": {
      margin: theme.spacing(1, 0),
      marginLeft: theme.spacing(1),
    },
  },
  addExpression: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  addSelect: {
    minWidth: "12ch",
  },
  removeNot: {
    marginTop: theme.spacing(1),
  },
}))

export const RemoveExpression: React.FC<{
  removeExpression: RemoveExpressionFn
  path: ExpressionPath
  label: string
  className?: string
}> = ({ removeExpression, path, label, className }) => {
  const onClick = React.useCallback(() => {
    removeExpression(path)
  }, [removeExpression, path])

  return (
    <SAB small delete onClick={onClick}>
      delete {label}
    </SAB>
  )
}

export enum ExpressionType {
  And = "and",
  Or = "or",
  Not = "not",
  Filter = "filter",
}

interface AddExpressionProps {
  path: ExpressionPath
  addExpression: AddExpressionFn
}
export const AddExpression: React.FC<AddExpressionProps> = ({
  addExpression,
  path,
}) => {
  const classes = useStyles()

  const onClick = React.useCallback(
    (type: ExpressionType) => () => {
      addExpression(path, type)
    },
    [path, addExpression]
  )

  return (
    <section className={classes.addExpression}>
      <PlainButton onClick={onClick(ExpressionType.Filter)} add small>
        filter
      </PlainButton>
      <PlainButton onClick={onClick(ExpressionType.Not)} add small>
        not
      </PlainButton>
      <PlainButton onClick={onClick(ExpressionType.And)} add small>
        and
      </PlainButton>
      <PlainButton onClick={onClick(ExpressionType.Or)} add small>
        or
      </PlainButton>
    </section>
  )
}

const Expression: React.FC<{
  type: FilterType
  expression: FilterExpression
  nesting: number
  path: (string | number)[]
  addExpression: AddExpressionFn
  removeExpression: RemoveExpressionFn
  dimensionFilter: (dim: GA4Dimension) => boolean
  metricFilter: (dim: GA4Metric) => boolean
  updateFilter: UpdateFilterFn
}> = ({
  type,
  expression,
  nesting,
  path,
  addExpression,
  removeExpression,
  dimensionFilter,
  metricFilter,
  updateFilter,
}) => {
  const classes = useStyles()
  if (expression.filter) {
    return (
      <Filter
        removeExpression={removeExpression}
        type={type}
        path={path.concat(["filter"])}
        updateFilter={updateFilter}
        nesting={nesting + 1}
        filter={expression.filter}
        dimensionFilter={dimensionFilter}
        metricFilter={metricFilter}
      />
    )
  }
  if (expression.andGroup) {
    return (
      <ExpressionList
        type={type}
        updateFilter={updateFilter}
        dimensionFilter={dimensionFilter}
        metricFilter={metricFilter}
        addExpression={addExpression}
        removeExpression={removeExpression}
        path={path.concat(["andGroup"])}
        nesting={nesting + 1}
        variant="and"
        expressionList={expression.andGroup}
      />
    )
  }
  if (expression.orGroup) {
    return (
      <ExpressionList
        type={type}
        updateFilter={updateFilter}
        addExpression={addExpression}
        removeExpression={removeExpression}
        dimensionFilter={dimensionFilter}
        metricFilter={metricFilter}
        path={path.concat(["orGroup"])}
        nesting={nesting + 1}
        variant="or"
        expressionList={expression.orGroup}
      />
    )
  }
  if (expression.notExpression) {
    return (
      <WithHelpText label="NOT" hrGroup className={classes.not}>
        <Expression
          type={type}
          metricFilter={metricFilter}
          updateFilter={updateFilter}
          addExpression={addExpression}
          removeExpression={removeExpression}
          path={path.concat(["notExpression"])}
          nesting={nesting + 1}
          expression={expression.notExpression}
          dimensionFilter={dimensionFilter}
        />
        <div className={classes.removeNot}>
          <RemoveExpression
            path={path.concat("notExpression")}
            removeExpression={removeExpression}
            label="not"
          />
        </div>
      </WithHelpText>
    )
  }
  return <AddExpression path={path} addExpression={addExpression} />
}

export default Expression
