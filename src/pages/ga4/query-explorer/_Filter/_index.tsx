import * as React from "react"
import {
  GA4Dimensions,
  GA4Dimension,
  GA4Metrics,
} from "../../../../components/GA4Pickers"
import { useState, useCallback } from "react"
import Expression, { ExpressionType } from "./_Expression"
import { Typography, makeStyles } from "@material-ui/core"
import { Dispatch } from "../../../../types"

const useStyles = makeStyles(theme => ({
  filter: {
    margin: theme.spacing(1, 0),
  },
  title: {
    margin: theme.spacing(1, 0),
  },
}))

export enum FilterType {
  Metric = "metric",
  Dimension = "dimension",
}

interface FilterProps {
  fields: GA4Dimensions | GA4Metrics
  setFilterExpression: Dispatch<FilterExpression | undefined>
  type: FilterType
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

const useFilter = () => {
  const [expression, setExpression] = useState<FilterExpression>({})

  const updateFilter = useCallback<UpdateFilter>(
    (path, update) => {
      setExpression(old => {
        const cloned = { ...old }
        const butLast = [...path]
        let last = butLast.pop()

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )

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

const Filter: React.FC<FilterProps> = ({
  fields,
  setFilterExpression,
  type,
}) => {
  const classes = useStyles()
  const {
    expression,
    addExpression,
    removeExpression,
    updateFilter,
  } = useFilter()

  const selectedFieldIds = React.useMemo(
    () => new Set((fields || []).map(d => d.apiName)),
    [fields]
  )

  // TODO - between filter is invalid for dimensions so we need a way to filter
  // which filters (ha) you can build.

  const fieldsFilter = useCallback(
    (dimension: GA4Dimension) => {
      return selectedFieldIds.has(dimension.apiName)
    },
    [selectedFieldIds]
  )

  React.useEffect(() => {
    if (Object.values(expression).length !== 0) {
      setFilterExpression(expression)
    }
  }, [expression, setFilterExpression])

  // TODO - look into use context to see if I can make these updateFilter,
  // dimensionFilter, etc things a bit cleaner.

  return (
    <section className={classes.filter}>
      <Typography variant="subtitle2" className={classes.title}>
        {type} filters
      </Typography>
      <Expression
        type={type}
        updateFilter={updateFilter}
        dimensionFilter={fieldsFilter}
        metricFilter={fieldsFilter}
        removeExpression={removeExpression}
        addExpression={addExpression}
        path={[]}
        expression={expression}
        nesting={-1}
      />
    </section>
  )
}

export default Filter
