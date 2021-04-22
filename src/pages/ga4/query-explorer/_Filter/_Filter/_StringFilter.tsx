import * as React from "react"
import Select from "../../../../../components/Select"
import { useStyles } from "./_index"
import TextField from "@material-ui/core/TextField"
import LabeledCheckbox from "../../../../../components/LabeledCheckbox"
import { UpdateFilterFn, ExpressionPath } from "../_index"

enum StringFilterMatchType {
  Exact = "EXACT",
  BeginsWith = "BEGINS_WITH",
  EndsWith = "ENDS_WITH",
  Contains = "CONTAINS",
  FullRegexp = "FULL_REGEXP",
  PartialRegexp = "PARTIAL_REGEXP",
}

type SFilter = gapi.client.analyticsdata.StringFilter

interface StringFilterProps {
  stringFilter: SFilter
  updateFilter: UpdateFilterFn
  path: ExpressionPath
}

const matchOptions = Object.values(StringFilterMatchType).map(option => ({
  value: option,
  displayName: option,
}))

const StringFilter: React.FC<StringFilterProps> = ({
  stringFilter,
  updateFilter,
  path,
}) => {
  const classes = useStyles()

  const matchValue = {
    value: stringFilter.matchType || "",
    displayName: stringFilter.matchType || "",
  }

  const updateStringFilter = React.useCallback(
    (update: (old: SFilter) => SFilter) => {
      updateFilter(path, old => ({
        ...old,
        stringFilter: update(old.stringFilter!),
      }))
    },
    [updateFilter, path]
  )

  return (
    <>
      <Select
        label="match type"
        className={classes.mediumWidth}
        value={matchValue}
        onChange={nu => {
          updateStringFilter(old => ({ ...old, matchType: nu?.value }))
        }}
        options={matchOptions}
      />
      <TextField
        size="small"
        variant="outlined"
        value={stringFilter.value || ""}
        onChange={e => {
          const nu = e.target.value
          updateStringFilter(old => ({ ...old, value: nu }))
        }}
      />
      <LabeledCheckbox
        checked={stringFilter.caseSensitive || false}
        setChecked={(checked: boolean) => {
          updateStringFilter(old => ({ ...old, caseSensitive: checked }))
        }}
      >
        case sensitive
      </LabeledCheckbox>
    </>
  )
}

export default StringFilter
