import * as React from "react"
import Filter from "./_Filter"
import { FilterExpression } from "./_index"
import { makeStyles, Typography } from "@material-ui/core"
import ExpressionList from "./_ExpressionList"

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

const Expression: React.FC<{
  expression: FilterExpression
  nesting: number
}> = ({ expression, nesting }) => {
  if (expression.filter) {
    return <Filter nesting={nesting + 1} filter={expression.filter} />
  }
  if (expression.andGroup) {
    return (
      <LabeledSection label="and">
        <ExpressionList
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
          nesting={nesting + 1}
          expression={expression.notExpression}
        />
      </LabeledSection>
    )
  }
  return null
}

export default Expression
