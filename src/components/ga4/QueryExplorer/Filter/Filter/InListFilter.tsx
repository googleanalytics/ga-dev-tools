import * as React from "react"

import SeparatedInput from "@/components/SeparatedInput"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { UpdateFilterFn, ExpressionPath } from "../index"

type ILFilter = gapi.client.analyticsdata.InListFilter

interface InListFilterProps {
  updateFilter: UpdateFilterFn
  path: ExpressionPath
  inListFilter: ILFilter
}

const InListFilter: React.FC<InListFilterProps> = ({
  updateFilter,
  path,
  inListFilter,
}) => {
  const updateInListFilter = React.useCallback(
    (update: (filter: ILFilter) => ILFilter) => {
      updateFilter(path, old => ({
        ...old,
        inListFilter: update(old.inListFilter!),
      }))
    },
    [path, updateFilter]
  )

  return (
    <>
      <SeparatedInput
        label="values"
        values={inListFilter.values || []}
        onChange={values => {
          updateInListFilter(old => ({ ...old, values }))
        }}
      />
      <LabeledCheckbox
        checked={inListFilter.caseSensitive || false}
        onChange={e => {
          updateInListFilter(old => ({ ...old, caseSensitive: e }))
        }}
      >
        case sensitive
      </LabeledCheckbox>
    </>
  )
}

export default InListFilter
