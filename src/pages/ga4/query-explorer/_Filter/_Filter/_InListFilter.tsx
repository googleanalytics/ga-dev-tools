import * as React from "react"
import { UpdateFilterFn, ExpressionPath } from "../_index"
import { useStyles } from "./_index"
import SeparatedInput from "../../../../../components/SeparatedInput"
import LabeledCheckbox from "../../../../../components/LabeledCheckbox"

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
  const classes = useStyles()

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
        className={classes.bigWidth}
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
