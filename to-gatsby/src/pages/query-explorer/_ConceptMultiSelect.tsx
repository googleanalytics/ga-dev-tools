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

import { Typography, TextField, makeStyles } from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Column } from "../../api"

const useStyles = makeStyles(_ => ({
  conceptOption: {
    display: "flex",
    width: "100%",
  },
  nameId: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    "& > p": {
      margin: 0,
      padding: 0,
    },
  },
  group: {},
}))

interface ConceptMultiSelectProps {
  label: string
  helperText: string
  columns: Column[] | undefined
  setSelectedColumns: (columns: Column[]) => void
}

export const ConceptMultiSelect: React.FC<ConceptMultiSelectProps> = ({
  label,
  helperText,
  columns,
  setSelectedColumns,
}) => {
  const classes = useStyles()
  const [localColumns, setLocalColumns] = React.useState<Column[]>([])

  React.useEffect(() => {
    setSelectedColumns(localColumns)
  }, [localColumns])

  // Filter out the deprecated columns so they can't be selected.
  const columnOptions = React.useMemo<Column[]>(
    () =>
      (columns || []).filter(
        column => column.attributes?.status !== "DEPRECATED"
      ),
    [columns]
  )

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
        <div className={classes.conceptOption}>
          <div className={classes.nameId}>
            <Typography variant="body1">{option.attributes!.uiName}</Typography>
            <Typography variant="subtitle2" color="primary">
              {option.id}
            </Typography>
          </div>
          <Typography
            className={classes.group}
            variant="subtitle1"
            color="textSecondary"
          >
            {option.attributes!.group}
          </Typography>
        </div>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          variant="outlined"
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export default ConceptMultiSelect
