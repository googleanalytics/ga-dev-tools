import * as React from "react"
import { makeStyles } from "@material-ui/core"
import { FilterExpressionList } from "./_index"
import Expression, { AddExpression, ExpressionType } from "./_Expression"
import { SAB } from "../../../../components/Buttons"
import { Delete } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
  buttons: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

const ExpressionList: React.FC<{
  expressionList: FilterExpressionList
  nesting: number
  variant: "and" | "or"
  path: (string | number)[]
  addExpression: (path: (string | number)[], type: ExpressionType) => void
  removeExpression: (path: (string | number)[]) => void
}> = ({
  expressionList,
  nesting,
  variant,
  path,
  addExpression,
  removeExpression,
}) => {
  const classes = useStyles()
  const onClick = React.useCallback(() => {
    removeExpression(path)
  }, [removeExpression, path])

  return (
    <>
      {expressionList.expressions?.map((expression, idx) => (
        <Expression
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
        <SAB onClick={onClick} startIcon={<Delete />}>
          remove {variant}
        </SAB>
      </section>
    </>
  )
}

export default ExpressionList
