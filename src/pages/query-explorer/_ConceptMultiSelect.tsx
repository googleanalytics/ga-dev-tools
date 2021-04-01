// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"

import { Typography, TextField } from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Column } from "../../api"
import { FancyOption } from "../../components/FancyOption"

interface ConceptMultiSelectProps {
  label: string
  helperText: string
  columns: Column[] | undefined
  setSelectedColumns: (columns: Column[]) => void
  viewId: string | undefined
  required?: true
}

export const ConceptMultiSelect: React.FC<ConceptMultiSelectProps> = ({
  label,
  helperText,
  columns,
  setSelectedColumns,
  viewId,
  required,
}) => {
  const [localColumns, setLocalColumns] = React.useState<Column[]>([])

  // TODO - maybe clean this up to be a tree instead of flat. i.e.
  // { viewId: {label: {columns...}} }
  React.useEffect(() => {
    const asString = window.localStorage.getItem(`${viewId} ${label} columns`)
    if (asString === null) {
      return
    }
    try {
      const parsed = JSON.parse(asString)
      setLocalColumns(parsed)
    } catch (e) {}
  }, [viewId, label])

  React.useEffect(() => {
    window.localStorage.setItem(
      `${viewId} ${label} columns`,
      JSON.stringify(localColumns)
    )
  }, [localColumns, label, viewId])

  React.useEffect(() => {
    setSelectedColumns(localColumns)
  }, [localColumns, setSelectedColumns])

  // Filter out the deprecated columns so they can't be selected.
  const columnOptions = React.useMemo<Column[]>(
    () =>
      (columns || []).filter(
        column => column.attributes?.status !== "DEPRECATED"
      ),
    [columns]
  )

  // TODO - the FancyOption children should probably also be generalized since
  // they need to all be formatted the same as well.

  return (
    <Autocomplete<Column, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      multiple
      debug
      options={columnOptions}
      getOptionLabel={option => option.id!}
      value={localColumns}
      onChange={(_event, value, _state) => setLocalColumns(value as Column[])}
      renderOption={option => (
        <FancyOption
          right={
            <Typography variant="subtitle1" color="textSecondary">
              {option.attributes!.group}
            </Typography>
          }
        >
          <Typography variant="body1">{option.attributes!.uiName}</Typography>
          <Typography variant="subtitle2" color="primary">
            {option.id}
          </Typography>
        </FancyOption>
      )}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label={label}
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export default ConceptMultiSelect
