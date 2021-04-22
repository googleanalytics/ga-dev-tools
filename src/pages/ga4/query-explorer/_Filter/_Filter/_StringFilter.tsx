import * as React from "react"
import Select, { SelectOption } from "../../../../../components/Select"
import { useStyles } from "./_index"
import TextField from "@material-ui/core/TextField"
import LabeledCheckbox from "../../../../../components/LabeledCheckbox"
import { UpdateFilterFn, ExpressionPath } from "../_index"

export enum MatchType {
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

const optionFor = (type: MatchType | undefined): SelectOption => {
  switch (type) {
    case MatchType.Exact:
      return { value: type, displayName: "exact" }
    case MatchType.BeginsWith:
      return { value: type, displayName: "begins with" }
    case MatchType.EndsWith:
      return { value: type, displayName: "ends with" }
    case MatchType.Contains:
      return { value: type, displayName: "contains" }
    case MatchType.FullRegexp:
      return { value: type, displayName: "regexp" }
    case MatchType.PartialRegexp:
      return { value: type, displayName: "partial regexp" }
    default:
      return { value: "", displayName: "" }
  }
}

const matchOptions = Object.values(MatchType).map(optionFor)

const StringFilter: React.FC<StringFilterProps> = ({
  stringFilter,
  updateFilter,
  path,
}) => {
  const classes = useStyles()

  const matchValue = optionFor(stringFilter.matchType as MatchType)

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
        onChange={(checked: boolean) => {
          updateStringFilter(old => ({ ...old, caseSensitive: checked }))
        }}
      >
        case sensitive
      </LabeledCheckbox>
    </>
  )
}

export default StringFilter
