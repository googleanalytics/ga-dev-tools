import * as React from "react"

import TextField from "@mui/material/TextField"

import Select, { SelectOption } from "@/components/Select"
import { UpdateFilterFn, ExpressionPath } from "../index"

type NFilter = gapi.client.analyticsdata.NumericFilter

interface NumericFilterProps {
  numericFilter: NFilter
  updateFilter: UpdateFilterFn
  path: ExpressionPath
}

export type OperationType = "EQUAL" | "LESS_THAN" | "LESS_THAN_OR_EQUAL" | "GREATER_THAN" | "GREATER_THAN_OR_EQUAL"

const operationTypeOptions: Record<OperationType, SelectOption> = {
  "EQUAL": { value: "EQUAL", displayName: "==" },
  "LESS_THAN": { value: "LESS_THAN", displayName: "<" },
  "LESS_THAN_OR_EQUAL": { value: "LESS_THAN_OR_EQUAL", displayName: "<=" },
  "GREATER_THAN": { value: "GREATER_THAN", displayName: ">" },
  "GREATER_THAN_OR_EQUAL": { value: "GREATER_THAN_OR_EQUAL", displayName: ">=" },
}

const optionFor = (type: OperationType | undefined): SelectOption =>
  type === undefined ? { value: "", displayName: "" } : operationTypeOptions[type]

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

const operationOptions = Object.values(operationTypeOptions)

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
          updateNumericFilter(old => ({
            ...old,
            operation: option?.value as OperationType | undefined,
          }))
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
