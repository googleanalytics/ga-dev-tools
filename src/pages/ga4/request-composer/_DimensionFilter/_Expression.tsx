import * as React from "react"
import Filter from "./_Filter"
import { FilterExpression } from "./_index"
import { makeStyles, Typography } from "@material-ui/core"
import ExpressionList from "./_ExpressionList"
import { SAB, PlainButton } from "../../../../components/Buttons"
import { Delete } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
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
  removeExpression: (path: (string | number)[]) => void
  path: (string | number)[]
  label: string
  className: string
}> = ({ removeExpression, path, label, className }) => {
  const onClick = React.useCallback(() => {
    removeExpression(path)
  }, [removeExpression, path])

  return (
    <SAB onClick={onClick} startIcon={<Delete />} className={className}>
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
  path: (string | number)[]
  addExpression: (path: (string | number)[], type: ExpressionType) => void
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
      <PlainButton onClick={onClick(ExpressionType.Filter)} add>
        filter
      </PlainButton>
      <PlainButton onClick={onClick(ExpressionType.Not)} add>
        not
      </PlainButton>
      <PlainButton onClick={onClick(ExpressionType.And)} add>
        and
      </PlainButton>
      <PlainButton onClick={onClick(ExpressionType.Or)} add>
        or
      </PlainButton>
    </section>
  )
}

const Expression: React.FC<{
  expression: FilterExpression
  nesting: number
  path: (string | number)[]
  addExpression: (path: (string | number)[], type: ExpressionType) => void
  removeExpression: (path: (string | number)[]) => void
}> = ({ expression, nesting, path, addExpression, removeExpression }) => {
  const classes = useStyles()
  if (expression.filter) {
    return <Filter nesting={nesting + 1} filter={expression.filter} />
  }
  if (expression.andGroup) {
    return (
      <LabeledSection label="and">
        <ExpressionList
          addExpression={addExpression}
          removeExpression={removeExpression}
          path={path.concat(["andGroup"])}
          nesting={nesting + 1}
          variant="and"
          expressionList={expression.andGroup}
        />
      </LabeledSection>
    )
  }
  if (expression.orGroup) {
    return (
      <LabeledSection label="or">
        <ExpressionList
          addExpression={addExpression}
          removeExpression={removeExpression}
          path={path.concat(["orGroup"])}
          nesting={nesting + 1}
          variant="or"
          expressionList={expression.orGroup}
        />
      </LabeledSection>
    )
  }
  if (expression.notExpression) {
    return (
      <LabeledSection label="not">
        <Expression
          addExpression={addExpression}
          removeExpression={removeExpression}
          path={path.concat(["notExpression"])}
          nesting={nesting + 1}
          expression={expression.notExpression}
        />
        <RemoveExpression
          className={classes.removeNot}
          path={path.concat("notExpression")}
          removeExpression={removeExpression}
          label="not"
        />
      </LabeledSection>
    )
  }
  return <AddExpression path={path} addExpression={addExpression} />
}

export default Expression
