import * as React from "react"

import TextField from "@material-ui/core/TextField"

import Select, { SelectOption } from "@/components/Select"
import { UpdateFilterFn, ExpressionPath } from "../index"

type NFilter = gapi.client.analyticsdata.NumericFilter

interface NumericFilterProps {
  numericFilter: NFilter
  updateFilter: UpdateFilterFn
  path: ExpressionPath
}

export enum OperationType {
  Equal = "EQUAL",
  LessThan = "LESS_THAN",
  LessThanOrEqual = "LESS_THAN_OR_EQUAL",
  GreaterThan = "GREATER_THAN",
  GreaterThanOrEqual = "GREATER_THAN_OR_EQUAL",
}

const optionFor = (type: OperationType | undefined): SelectOption => {
  switch (type) {
    case OperationType.GreaterThan:
      return { value: type, displayName: ">" }
    case OperationType.GreaterThanOrEqual:
      return { value: type, displayName: ">=" }
    case OperationType.Equal:
      return { value: type, displayName: "==" }
    case OperationType.LessThan:
      return { value: type, displayName: "<" }
    case OperationType.LessThanOrEqual:
      return { value: type, displayName: "<=" }
    default:
      return { value: "", displayName: "" }
  }
}

type NumericValue = gapi.client.analyticsdata.NumericValue

export const numericValueEquals = (
  a: NumericValue,
  b: NumericValue | undefined
) => {
  if (b === undefined) {
    return false
  }
  return a.int64Value === b.int64Value && a.doubleValue === b.doubleValue
}

export const toNumericValue = (s: string) => {
  const nuVal: NumericValue = {
    int64Value: undefined,
    doubleValue: undefined,
  }
  const parsed = parseFloat(s)
  if (s === "" || isNaN(parsed)) {
    return nuVal
  }
  if (s.indexOf(".") === -1) {
    nuVal.int64Value = s
  } else {
    nuVal.doubleValue = parsed
  }
  return nuVal
}

const operationOptions = Object.values(OperationType).map(optionFor)

// TODO instead of having a filter type drop down, include `between` here and do
// the smarts to choose the right subtype correctly.
const NumericFilter: React.FC<NumericFilterProps> = ({
  numericFilter,
  updateFilter,
  path,
}) => {
  const [value, setValue] = React.useState(
    numericFilter.value?.int64Value ||
      numericFilter.value?.doubleValue?.toString() ||
      ""
  )

  const updateNumericFilter = React.useCallback(
    (update: (old: NFilter) => NFilter) => {
      updateFilter(path, old => ({
        ...old,
        numericFilter: update(old.numericFilter!),
      }))
    },
    [path, updateFilter]
  )

  React.useEffect(() => {
    const nuVal = toNumericValue(value)
    if (numericValueEquals(nuVal, numericFilter.value)) {
      return
    }
    updateNumericFilter(old => ({ ...old, value: nuVal }))
  }, [value, updateNumericFilter, numericFilter.value])

  return (
    <>
      <Select
        value={optionFor(numericFilter.operation as OperationType | undefined)}
        label="operation"
        onChange={option => {
          updateNumericFilter(old => ({ ...old, operation: option?.value }))
        }}
        options={operationOptions}
      />
      <TextField
        size="small"
        variant="outlined"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
    </>
  )
}

export default NumericFilter
