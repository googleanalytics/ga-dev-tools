import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import Typography from "@material-ui/core/Typography"
import Delete from "@material-ui/icons/Delete"

import { SAB, PlainButton } from "@/components/Buttons"
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
  labeledSection: {
    padding: theme.spacing(0, 2),
    margin: theme.spacing(2, 0),
    // borderRadius: theme.spacing(1),
    // border: "1px solid black",
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
    marginLeft: theme.spacing(1),
  },
}))

const LabeledSection: React.FC<{
  label: string
}> = ({ label, children }) => {
  const classes = useStyles()
  return (
    <div className={classes.labeledSection}>
      <Typography className={classes.label} component="span">
        {label}
      </Typography>
      <div className={classes.childrenGroup}>
        <hr className={classes.vrhr} />
        <section className={classes.children}>{children}</section>
      </div>
    </div>
  )
}

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
    <SAB onClick={onClick} delete small className={className}>
      remove {label}
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
      <WithHelpText notched label="and">
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
      </WithHelpText>
    )
  }
  if (expression.orGroup) {
    return (
      <WithHelpText notched label="or">
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
      </WithHelpText>
    )
  }
  if (expression.notExpression) {
    return (
      <WithHelpText notched label="not">
        <section className={classes.not}>
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
          <RemoveExpression
            className={classes.removeNot}
            path={path.concat("notExpression")}
            removeExpression={removeExpression}
            label="not"
          />
        </section>
      </WithHelpText>
    )
  }
  return <AddExpression path={path} addExpression={addExpression} />
}

export default Expression
