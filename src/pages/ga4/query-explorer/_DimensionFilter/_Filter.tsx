import * as React from "react"
import { makeStyles, TextField, IconButton } from "@material-ui/core"
import { BaseFilter, UpdateFilter } from "./_index"
import { useState, useMemo } from "react"
import {
  GA4Dimension,
  DimensionPicker,
} from "../../../../components/GA4Pickers"
import Select, { SelectOption } from "../../../../components/Select"
import LabeledCheckbox from "../../../../components/LabeledCheckbox"
import clsx from "classnames"
import SeparatedInput from "../../../../components/SeparatedInput"
import { Delete } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
  indented: {
    marginLeft: theme.spacing(1),
  },
  filterType: {
    width: "15ch",
  },
  shortWidth: {
    width: "11ch",
  },
  mediumWidth: {
    width: "22ch",
  },
  bigWidth: {
    width: "33ch",
  },
  orDimension: {
    maxWidth: "25ch",
  },
  filter: {
    display: "flex",
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

enum StringFilterMatchType {
  Exact = "EXACT",
  BeginsWith = "BEGINS_WITH",
  EndsWith = "ENDS_WITH",
  Contains = "CONTAINS",
  FullRegexp = "FULL_REGEXP",
  PartialRegexp = "PARTIAL_REGEXP",
}

const Filter: React.FC<{
  filter: BaseFilter
  nesting: number
  dimensionFilter: (dim: GA4Dimension) => boolean
  updateFilter: UpdateFilter
  path: (string | number)[]
}> = ({ filter, nesting, dimensionFilter, updateFilter, path }) => {
  const classes = useStyles()
  const [dimension, setDimension] = useState<GA4Dimension>()
  const [, setOption] = useState<SelectOption>()
  const [, setOption2] = useState<SelectOption>()

  // TODO rename this to the query explorer instead of request composer.

  React.useEffect(() => {
    if (filter.fieldName !== dimension?.apiName) {
      updateFilter(path, old => {
        return { ...old, fieldName: dimension?.apiName }
      })
    }
  }, [path, dimension, updateFilter, filter.fieldName])

  const [inner, filterOption] = useMemo(() => {
    let filterOption: SelectOption | undefined = undefined
    let inner: JSX.Element | null = null
    if (filter.stringFilter !== undefined) {
      filterOption = { value: "stringFilter", displayName: "string" }
      const str = filter.stringFilter
      inner = (
        <>
          <Select
            label="match type"
            className={classes.mediumWidth}
            value={{
              value: StringFilterMatchType.Contains,
              displayName: StringFilterMatchType.Contains,
            }}
            setValue={setOption2}
            options={Object.values(StringFilterMatchType).map(option => ({
              value: option,
              displayName: option,
            }))}
          />
          <TextField size="small" variant="outlined" value={str.value || ""} />
          <LabeledCheckbox
            checked={str.caseSensitive || false}
            setChecked={(_: boolean) => {}}
          >
            case sensitive
          </LabeledCheckbox>
        </>
      )
    }
    if (filter.numericFilter !== undefined) {
      const numeric = filter.numericFilter
      filterOption = { value: "numericFilter", displayName: "numeric" }
      inner = (
        <>
          <Select
            value={{ value: ">", displayName: ">" }}
            label="operation"
            setValue={setOption}
            options={[">", ">=", "==", "<=", "<"].map(a => ({
              value: a,
              displayName: a,
            }))}
          />
          <TextField
            className={classes.shortWidth}
            size="small"
            variant="outlined"
            value={
              numeric.value?.int64Value || numeric.value?.doubleValue || ""
            }
          />
        </>
      )
    }
    if (filter.inListFilter !== undefined) {
      const inList = filter.inListFilter
      filterOption = { value: "inListFilter", displayName: "in list" }
      inner = (
        <>
          <SeparatedInput
            className={classes.bigWidth}
            label="values"
            initialValues={inList.values || []}
          />
          <LabeledCheckbox
            checked={inList.caseSensitive || false}
            setChecked={(_: boolean) => {}}
          >
            case sensitive
          </LabeledCheckbox>
        </>
      )
    }
    if (filter.betweenFilter !== undefined) {
      const between = filter.betweenFilter
      filterOption = { value: "betweenFilter", displayName: "between" }
      inner = (
        <>
          <TextField
            className={classes.shortWidth}
            size="small"
            variant="outlined"
            label={"From"}
            onChange={e => {
              const val = e.target.value
              const nuVal =
                val.indexOf(".") === -1
                  ? { int64Value: val }
                  : { doubleValue: val }
              updateFilter(path.concat(["betweenFilter"]), old => ({
                ...old,
                fromValue: nuVal,
              }))
            }}
            value={
              between.fromValue?.int64Value ||
              between.fromValue?.doubleValue ||
              ""
            }
          />
          <TextField
            className={classes.shortWidth}
            size="small"
            variant="outlined"
            label={"To"}
            onChange={e => {
              const val = e.target.value
              const nuVal =
                val.indexOf(".") === -1
                  ? { int64Value: val }
                  : { doubleValue: val }
              updateFilter(path.concat(["betweenFilter"]), old => ({
                ...old,
                toValue: nuVal,
              }))
            }}
            value={
              between.toValue?.int64Value || between.toValue?.doubleValue || ""
            }
          />
        </>
      )
    }
    return [inner, filterOption]
  }, [
    filter,
    classes.shortWidth,
    classes.bigWidth,
    classes.mediumWidth,
    updateFilter,
    path,
  ])

  return (
    <section
      className={clsx(classes.filter, { [classes.indented]: nesting > 0 })}
    >
      <IconButton>
        <Delete />
      </IconButton>
      <DimensionPicker
        autoSelectIfOne
        dimensionFilter={dimensionFilter}
        setDimension={setDimension}
        className={classes.orDimension}
      />
      <Select
        value={filterOption}
        label="filter type"
        onChange={nu => {
          if (nu === undefined) {
            return
          }
          updateFilter(path, old => ({
            fieldName: old.fieldName,
            [nu.value]: {},
          }))
        }}
        className={classes.filterType}
        options={[
          { value: "stringFilter", displayName: "string" },
          { value: "numericFilter", displayName: "numeric" },
          { value: "inListFilter", displayName: "in list" },
          { value: "betweenFilter", displayName: "between" },
        ]}
      />
      {inner}
    </section>
  )
}

export default Filter