import * as React from "react"
import { GA4Dimensions, GA4Dimension } from "../../../../components/GA4Pickers"
import { useState, useCallback } from "react"
import Expression, { ExpressionType } from "./_Expression"
import { Typography } from "@material-ui/core"
import { Dispatch } from "../../../../types"

interface DimensionFilterProps {
  dimensions: GA4Dimensions
  setDimensionFilter: Dispatch<FilterExpression | undefined>
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

export type UpdateFilter = (
  path: (string | number)[],
  update: (old: BaseFilter) => BaseFilter
) => void

const useDimensionFilter = (_: GA4Dimensions) => {
  const [expression, setExpression] = useState<FilterExpression>({})

  const updateFilter = useCallback<UpdateFilter>(
    (path, update) => {
      setExpression(old => {
        console.log(JSON.stringify(old, undefined, " "))
        console.log("path", path)
        const cloned = { ...old }
        const butLast = [...path]
        let last = butLast.pop()

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )

        console.log({ last, butLast, navigated })

        navigated[last as any] = update(navigated[last as any])

        console.log({ last, butLast, navigated })

        return cloned
      })
    },
    [setExpression]
  )

  const removeExpression = useCallback(
    (path: (string | number)[]) => {
      setExpression(old => {
        // console.log(JSON.stringify(old, undefined, " "))
        // console.log("path", path)
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

  return { expression, addExpression, removeExpression, updateFilter }
}

const DimensionFilter: React.FC<DimensionFilterProps> = ({
  dimensions,
  setDimensionFilter,
}) => {
  const {
    expression,
    addExpression,
    removeExpression,
    updateFilter,
  } = useDimensionFilter(dimensions)

  const selectedDimensionIds = React.useMemo(
    () => new Set((dimensions || []).map(d => d.apiName)),
    [dimensions]
  )

  // TODO - between filter is invalid for dimensions so we need a way to filter
  // which filters (ha) you can build.

  const dimensionFilter = useCallback(
    (dimension: GA4Dimension) => {
      return selectedDimensionIds.has(dimension.apiName)
    },
    [selectedDimensionIds]
  )

  React.useEffect(() => {
    if (Object.values(expression).length !== 0) {
      setDimensionFilter(expression)
    }
  }, [expression, setDimensionFilter])

  // TODO - look into use context to see if I can make these updateFilter,
  // dimensionFilter, etc things a bit cleaner.

  return (
    <section>
      <Typography variant="subtitle2" style={{ marginTop: "unset" }}>
        dimension filters
      </Typography>
      <Expression
        updateFilter={updateFilter}
        dimensionFilter={dimensionFilter}
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