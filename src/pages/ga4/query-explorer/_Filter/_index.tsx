import * as React from "react"
import {
  GA4Dimensions,
  GA4Dimension,
  GA4Metrics,
} from "../../../../components/GA4Pickers"
import { useCallback } from "react"
import Expression from "./_Expression"
import { Typography, makeStyles } from "@material-ui/core"
import { Dispatch } from "../../../../types"
import useFilter from "./_useFilter"

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

export type UpdateFilter = (
  path: (string | number)[],
  update: (old: BaseFilter) => BaseFilter
) => void

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
