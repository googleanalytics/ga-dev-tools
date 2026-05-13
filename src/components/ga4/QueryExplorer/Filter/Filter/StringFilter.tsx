import * as React from "react"

import TextField from "@mui/material/TextField"

import Select, { SelectOption } from "@/components/Select"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { UpdateFilterFn, ExpressionPath } from "../index"

export type MatchType = "EXACT" | "BEGINS_WITH" | "ENDS_WITH" | "CONTAINS" | "FULL_REGEXP" | "PARTIAL_REGEXP"

type SFilter = gapi.client.analyticsdata.StringFilter

interface StringFilterProps {
  stringFilter: SFilter
  updateFilter: UpdateFilterFn
  path: ExpressionPath
}

const matchTypeOptions: Record<MatchType, SelectOption> = {
  "EXACT": { value: "EXACT", displayName: "exact" },
  "BEGINS_WITH": { value: "BEGINS_WITH", displayName: "begins with" },
  "ENDS_WITH": { value: "ENDS_WITH", displayName: "ends with" },
  "CONTAINS": { value: "CONTAINS", displayName: "contains" },
  "FULL_REGEXP": { value: "FULL_REGEXP", displayName: "regexp" },
  "PARTIAL_REGEXP": { value: "PARTIAL_REGEXP", displayName: "partial regexp" },
}

const optionFor = (type: MatchType | undefined): SelectOption =>
  type === undefined ? { value: "", displayName: "" } : matchTypeOptions[type]

const matchOptions = Object.values(matchTypeOptions)

const StringFilter: React.FC<StringFilterProps> = ({
  stringFilter,
  updateFilter,
  path,
}) => {

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
        value={matchValue}
        onChange={nu => {
          updateStringFilter(old => ({
            ...old,
            matchType: nu?.value as MatchType | undefined,
          }))
        }}
        options={matchOptions}
      />
      <TextField
        size="small"
        variant="outlined"
        value={stringFilter.value || ""}
        label="value"
        onChange={e => {
          const nu = e.target.value
          updateStringFilter((old: any) => ({ ...old, value: nu }))
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
