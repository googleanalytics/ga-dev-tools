import * as React from "react"
import { styled } from '@mui/material/styles';
import { useCallback } from "react"

import Typography from "@mui/material/Typography"

import { Dispatch } from "@/types"
import { StorageKey } from "@/constants"
import {
  GA4Dimensions,
  GA4Dimension,
  GA4Metrics,
} from "@/components/GA4Pickers"
import Expression, { ExpressionType } from "./Expression"
import useFilter, { UseFilterContext } from "./useFilter"

const PREFIX = 'Filter';

const classes = {
  filter: `${PREFIX}-filter`,
  title: `${PREFIX}-title`
};

const StyledUseFilterContextProvider = styled(UseFilterContext.Provider)((
  {
    theme
  }
) => ({
  [`& .${classes.filter}`]: ({ notched }: Props) => ({
    marginTop: notched ? theme.spacing(1) : "unset",
  }),

  [`& .${classes.title}`]: {
    margin: theme.spacing(1, 0),
  }
}));

interface Props {
  notched: boolean
}

export enum FilterType {
  Metric = "metric",
  Dimension = "dimension",
}

interface FilterProps {
  showAdvanced: boolean
  fields: GA4Dimensions | GA4Metrics
  setFilterExpression: Dispatch<FilterExpression | undefined>
  type: FilterType
  storageKey: StorageKey
}

export type FilterExpression = gapi.client.analyticsdata.FilterExpression
export type FilterExpressionList = gapi.client.analyticsdata.FilterExpressionList
export type BaseFilter = NonNullable<FilterExpression["filter"]>

export type ExpressionPath = (string | number)[]

export type UpdateFilterFn = (
  path: ExpressionPath,
  update: (old: BaseFilter) => BaseFilter
) => void
export type RemoveExpressionFn = (path: ExpressionPath) => void
export type AddExpressionFn = (
  path: ExpressionPath,
  type: ExpressionType
) => void

const Filter: React.FC<FilterProps> = ({
  showAdvanced,
  fields,
  setFilterExpression,
  type,
  storageKey,
}) => {

  const useFilterValue = useFilter(storageKey, showAdvanced)
  const {
    expression,
    addExpression,
    removeExpression,
    updateFilter,
  } = useFilterValue

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
    if (expression !== undefined && Object.keys(expression).length !== 0) {
      setFilterExpression(expression)
    } else {
      setFilterExpression(undefined)
    }
  }, [expression, setFilterExpression])

  const noFiltersConfigured = React.useMemo(() => {
    if (expression === undefined || Object.keys(expression).length === 0) {
      return (
        <Typography>
          No filter is configured. Use the buttons below to create a filter.
        </Typography>
      )
    }
    return null
  }, [expression])

  return (
    <StyledUseFilterContextProvider value={{ ...useFilterValue }}>
      <section className={classes.filter}>
        {noFiltersConfigured}
        <Expression
          type={type}
          updateFilter={updateFilter}
          dimensionFilter={fieldsFilter}
          metricFilter={fieldsFilter}
          removeExpression={removeExpression}
          addExpression={addExpression}
          path={[]}
          expression={expression || {}}
          nesting={-1}
        />
      </section>
    </StyledUseFilterContextProvider>
  );
}

export default Filter
