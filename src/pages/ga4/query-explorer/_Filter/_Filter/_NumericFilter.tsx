import * as React from "react"
import { UpdateFilterFn, ExpressionPath } from "../_index"
import Select, { SelectOption } from "../../../../../components/Select"
import TextField from "@material-ui/core/TextField"
import { useStyles } from "./_index"

type NFilter = gapi.client.analyticsdata.NumericFilter

interface NumericFilterProps {
  numericFilter: NFilter
  updateFilter: UpdateFilterFn
  path: ExpressionPath
}

enum OperationType {
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

const operationOptions = Object.values(OperationType).map(optionFor)

const NumericFilter: React.FC<NumericFilterProps> = ({
  numericFilter,
  updateFilter,
  path,
}) => {
  const classes = useStyles()
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
    const nuVal: NFilter["value"] = {
      int64Value: undefined,
      doubleValue: undefined,
    }
    const parsed = parseFloat(value)
    if (value === "" || isNaN(parsed)) {
      if (
        numericFilter.value?.int64Value === undefined &&
        numericFilter.value?.doubleValue === undefined
      ) {
        return
      }
      updateNumericFilter(old => ({ ...old, value: nuVal }))
      return
    }
    if (value.indexOf(".") === -1) {
      if (numericFilter.value?.int64Value === value) {
        return
      }
      nuVal.int64Value = value
    } else {
      nuVal.doubleValue = parseFloat(value)
      if (numericFilter.value?.doubleValue === parsed) {
        return
      }
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
        className={classes.shortWidth}
        size="small"
        variant="outlined"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
    </>
  )
}

export default NumericFilter
