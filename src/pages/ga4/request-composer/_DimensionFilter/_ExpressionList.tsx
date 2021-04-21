import * as React from "react"
// import { makeStyles } from "@material-ui/core"
import { FilterExpressionList } from "./_index"
import Expression from "./_Expression"

// const useStyles = makeStyles(theme => ({
//   splitAnds: {
//     width: "80%",
//     marginBottom: theme.spacing(1),
//   },
// }))

const ExpressionList: React.FC<{
  expressionList: FilterExpressionList
  nesting: number
  variant: "and" | "or"
}> = ({ expressionList, nesting, variant }) => {
  // const classes = useStyles()
  // const expressions = expressionList.expressions || []
  return (
    <>
      {expressionList.expressions?.map((expression, idx) => {
        // const isLast = idx + 1 === expressionList.expressions?.length

        // const before = expressions[idx - 1]
        // const after = expressions[idx + 1]

        // const beforeIsAnd = before?.andGroup !== undefined
        // const isAnd = expression.andGroup !== undefined
        // const afterIsAnd = after?.andGroup !== undefined

        // const beforeIsOr = before?.orGroup !== undefined
        // const isOr = expression.orGroup !== undefined
        // const afterIsOr = after?.orGroup !== undefined

        // const showHR =
        //   !isLast &&
        //   !beforeIsAnd &&
        //   !afterIsAnd &&
        //   !isAnd &&
        //   !beforeIsOr &&
        //   !afterIsOr &&
        //   !isOr

        return (
          <>
            <Expression
              key={`${variant}-${nesting}-${idx}`}
              expression={expression}
              nesting={nesting + 1}
            />
            {/*
            showHR ? (
              <hr
                key={`${variant}-${nesting}-${idx}-hr`}
                className={classes.splitAnds}
              />
            ) : null
              */}
          </>
        )
      })}
    </>
  )
}

export default ExpressionList
