import * as React from "react"
import { GA4Dimensions } from "../../../../components/GA4Pickers"
import { useState, useCallback } from "react"
import Expression, { ExpressionType } from "./_Expression"
import { Typography } from "@material-ui/core"

interface DimensionFilterProps {
  dimensions: GA4Dimensions
}

export type FilterExpression = gapi.client.analyticsdata.FilterExpression
export type FilterExpressionList = gapi.client.analyticsdata.FilterExpressionList
export type BaseFilter = NonNullable<FilterExpression["filter"]>

const subFor = (type: ExpressionType): FilterExpression => {
  switch (type) {
    case ExpressionType.And:
      return { andGroup: { expressions: [] } }
    case ExpressionType.Or:
      return { orGroup: { expressions: [] } }
    case ExpressionType.Not:
      return { notExpression: {} }
    case ExpressionType.Filter:
      return { filter: {} }
  }
}

const useDimensionFilter = (_: GA4Dimensions) => {
  const [expression, setExpression] = useState<FilterExpression>({})

  const removeExpression = useCallback(
    (path: (string | number)[]) => {
      setExpression(old => {
        console.log(JSON.stringify(old, undefined, " "))
        console.log("path", path)
        const cloned = { ...old }
        const butLast = [...path]
        let last = butLast.pop()

        if (
          last === "andGroup" ||
          last === "orGroup" ||
          last === "notExpression"
        ) {
          last = butLast.pop()
        }

        // If there is no last, that means we're at the top level
        if (last === undefined) {
          return {}
        }

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )

        if (Array.isArray(navigated)) {
          navigated.splice(last as number, 1)
        }

        navigated[last] = {}

        return cloned
      })
    },
    [setExpression]
  )

  const addExpression = useCallback(
    (path: (string | number)[], type: ExpressionType) => {
      setExpression(old => {
        console.log(JSON.stringify(old, undefined, " "))
        console.log("path", path)
        const cloned = { ...old }
        const butLast = [...path]
        const last = butLast.pop()

        const sub = subFor(type)

        // If there is no last, that means we're at the top level
        if (last === undefined) {
          return sub
        }

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )
        navigated[last] = sub

        return cloned
      })
    },
    [setExpression]
  )

  return { expression, addExpression, removeExpression }
}

const DimensionFilter: React.FC<DimensionFilterProps> = ({ dimensions }) => {
  const { expression, addExpression, removeExpression } = useDimensionFilter(
    dimensions
  )

  return (
    <section>
      <Typography variant="subtitle2" style={{ marginTop: "unset" }}>
        dimension filters
      </Typography>
      <Expression
        removeExpression={removeExpression}
        addExpression={addExpression}
        path={[]}
        expression={expression}
        nesting={-1}
      />
    </section>
  )
}

export default DimensionFilter
