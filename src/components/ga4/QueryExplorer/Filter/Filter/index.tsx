import * as React from "react"
import { useState, useMemo } from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import clsx from "classnames"

import Select, { SelectOption } from "@/components/Select"
import { SAB } from "@/components/Buttons"
import WithHelpText from "@/components/WithHelpText"
import {
  GA4Dimension,
  DimensionPicker,
  GA4Metric,
  MetricPicker,
} from "@/components/GA4Pickers"
import { UseFilterContext } from "../useFilter"
import {
  BaseFilter,
  UpdateFilterFn,
  FilterType,
  ExpressionPath,
  RemoveExpressionFn,
} from "../index"
import StringFilter, { MatchType } from "./StringFilter"
import NumericFilter, { OperationType } from "./NumericFilter"
import InListFilter from "./InListFilter"
import BetweenFilter from "./BetweenFilter"

export const useStyles = makeStyles(theme => ({
  caseSensitive: {
    marginLeft: theme.spacing(1),
    marginTop: "0 !important",
  },
  button: {
    marginTop: theme.spacing(1),
  },
  filter: {
    display: "flex",
    flexDirection: "column",
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

const Filter: React.FC<{
  filter: BaseFilter
  nesting: number
  dimensionFilter: (dim: GA4Dimension) => boolean
  metricFilter: (met: GA4Metric) => boolean
  updateFilter: UpdateFilterFn
  removeExpression: RemoveExpressionFn
  path: ExpressionPath
  type: FilterType
}> = ({
  filter,
  dimensionFilter,
  metricFilter,
  updateFilter,
  removeExpression,
  path,
  type,
}) => {
  const classes = useStyles()
  const [dimension, setDimension] = useState<GA4Dimension>()
  const [metric, setMetric] = useState<GA4Metric>()

  // When the dimension/metric name changes, update the filter.
  React.useEffect(() => {
    const field = type === "metric" ? metric : dimension
    if (filter.fieldName !== field?.apiName) {
      updateFilter(path, old => {
        return { ...old, fieldName: field?.apiName }
      })
    }
  }, [path, dimension, metric, updateFilter, filter.fieldName, type])

  const [inner, filterOption] = useMemo(() => {
    let filterOption: SelectOption | undefined = undefined
    let inner: JSX.Element | null = null
    if (filter.stringFilter !== undefined) {
      filterOption = { value: "stringFilter", displayName: "string" }
      inner = (
        <StringFilter
          stringFilter={filter.stringFilter}
          updateFilter={updateFilter}
          path={path}
        />
      )
    }
    if (filter.numericFilter !== undefined) {
      filterOption = { value: "numericFilter", displayName: "numeric" }
      inner = (
        <NumericFilter
          numericFilter={filter.numericFilter}
          updateFilter={updateFilter}
          path={path}
        />
      )
    }
    if (filter.inListFilter !== undefined) {
      filterOption = { value: "inListFilter", displayName: "in list" }
      inner = (
        <InListFilter
          inListFilter={filter.inListFilter}
          updateFilter={updateFilter}
          path={path}
        />
      )
    }
    if (filter.betweenFilter !== undefined) {
      filterOption = { value: "betweenFilter", displayName: "between" }
      inner = (
        <BetweenFilter
          betweenFilter={filter.betweenFilter}
          updateFilter={updateFilter}
          path={path}
        />
      )
    }
    return [inner, filterOption]
  }, [filter, updateFilter, path])

  const onClick = React.useCallback(() => {
    removeExpression(path)
  }, [removeExpression, path])

  const { showAdvanced } = React.useContext(UseFilterContext)!

  return (
    <WithHelpText
      notched={showAdvanced}
      label={showAdvanced ? "filter" : undefined}
    >
      <section className={classes.filter}>
        {type === "metric" ? (
          <MetricPicker
            label="metric"
            autoSelectIfOne={showAdvanced}
            metricFilter={metricFilter}
            setMetric={setMetric}
          />
        ) : (
          <DimensionPicker
            label="dimension"
            autoSelectIfOne={showAdvanced}
            dimensionFilter={dimensionFilter}
            setDimension={setDimension}
          />
        )}
        <Select
          value={filterOption}
          label="filter type"
          onChange={nu => {
            if (nu === undefined) {
              return
            }
            const value = {}
            if (nu.value === "numericFilter") {
              value["operation"] = OperationType.Equal
            }
            if (nu.value === "stringFilter") {
              value["matchType"] = MatchType.Exact
            }
            updateFilter(path, old => ({
              fieldName: old.fieldName,
              [nu.value]: value,
            }))
          }}
          options={
            type === "metric"
              ? [
                  { value: "numericFilter", displayName: "numeric" },
                  { value: "betweenFilter", displayName: "between" },
                ]
              : [
                  { value: "stringFilter", displayName: "string" },
                  { value: "inListFilter", displayName: "in list" },
                ]
          }
        />
        {inner}
      </section>

      {showAdvanced && (
        <div className={clsx(classes.button)}>
          <SAB onClick={onClick} small delete>
            filter
          </SAB>
        </div>
      )}
    </WithHelpText>
  )
}

export default Filter
