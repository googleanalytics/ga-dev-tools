import * as React from "react"
import { makeStyles } from "@material-ui/core"
import { FilterExpressionList, UpdateFilter } from "./_index"
import Expression, {
  AddExpression,
  ExpressionType,
  RemoveExpression,
} from "./_Expression"
import { GA4Dimension } from "../../../../components/GA4Pickers"

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
  dimensionFilter: (dim: GA4Dimension) => boolean
  updateFilter: UpdateFilter
}> = ({
  expressionList,
  nesting,
  variant,
  path,
  addExpression,
  removeExpression,
  dimensionFilter,
  updateFilter,
}) => {
  const classes = useStyles()

  return (
    <>
      {expressionList.expressions?.map((expression, idx) => (
        <Expression
          updateFilter={updateFilter}
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
    </>
  )
}

export default ExpressionList
