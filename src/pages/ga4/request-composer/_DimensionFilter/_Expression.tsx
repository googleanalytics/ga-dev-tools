import * as React from "react"
import Filter from "./_Filter"
import { FilterExpression } from "./_index"
import { makeStyles, Typography } from "@material-ui/core"
import ExpressionList from "./_ExpressionList"
import Select, { SelectOption } from "../../../../components/Select"
import { SAB } from "../../../../components/Buttons"
import { Add } from "@material-ui/icons"

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

export enum ExpressionType {
  And = "and",
  Or = "or",
  Not = "not",
  Filter = "filter",
}
const expressionOptions = [
  { value: ExpressionType.And, displayName: "and" },
  { value: ExpressionType.Or, displayName: "or" },
  { value: ExpressionType.Not, displayName: "not" },
  { value: ExpressionType.Filter, displayName: "filter" },
]

interface AddExpressionProps {
  path: (string | number)[]
  addExpression: (path: (string | number)[], type: ExpressionType) => void
}
export const AddExpression: React.FC<AddExpressionProps> = ({
  addExpression,
  path,
}) => {
  const classes = useStyles()
  const [value, setValue] = React.useState<SelectOption | undefined>(
    expressionOptions[0]
  )

  const onClick = React.useCallback(() => {
    if (value === undefined) {
      return
    }
    addExpression(path, value.value as ExpressionType)
  }, [value, path, addExpression])

  return (
    <section className={classes.addExpression}>
      <Select
        className={classes.addSelect}
        options={expressionOptions}
        value={value}
        setValue={setValue}
        label="type"
      />
      <SAB onClick={onClick} startIcon={<Add />}>
        expression
      </SAB>
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
      </LabeledSection>
    )
  }
  return <AddExpression path={path} addExpression={addExpression} />
}

export default Expression
