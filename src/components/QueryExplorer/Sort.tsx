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

import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Autocomplete from "@material-ui/lab/Autocomplete"

import { Column } from "@/api"
import { SortableColumn } from "."

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

interface SortProps {
  columns: Column[]
  setSort: (sortableColumns: SortableColumn[] | undefined) => void
}

const Sort: React.FC<SortProps> = ({ columns, setSort }) => {
  const classes = useStyles()
  const [localSortColumns, setLocalSortColumns] = React.useState<
    SortableColumn[]
  >([])
  const sortableColumns = React.useMemo<SortableColumn[]>(
    () =>
      columns
        // Only include columns that have not already been selected.
        .filter(
          column =>
            localSortColumns.find(
              localColumn => localColumn.id === column.id
            ) === undefined
        )
        // Create and ascending and descending option for every column.
        .flatMap(column => [
          { ...column, sort: "ASCENDING" },
          { ...column, sort: "DESCENDING" },
        ]),

    [columns, localSortColumns]
  )

  // When the available columns change, filter out any values that are no
  // longer valid.
  React.useEffect(() => {
    const nuLocalSort = localSortColumns.filter(localSortColumn =>
      columns.find(column => localSortColumn.id === column.id)
    )
    if (nuLocalSort.length !== localSortColumns.length) {
      setLocalSortColumns(nuLocalSort)
    }
  }, [columns, localSortColumns])

  React.useEffect(() => {
    if (localSortColumns.length === 0) {
      setSort(undefined)
    } else {
      setSort(localSortColumns)
    }
  }, [localSortColumns, setSort])

  // TODO renderOption={...} should be extracted since this and
  // _ConceptMultiSelect use the same styling.
  return (
    <Autocomplete<SortableColumn, true, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      multiple
      debug
      noOptionsText="A Metric or Dimension is required in order to sort."
      options={sortableColumns}
      getOptionLabel={option =>
        `${option.sort === "ASCENDING" ? "" : "-"}${option.id}`
      }
      value={localSortColumns}
      onChange={(_event, value, _state) =>
        setLocalSortColumns(value as SortableColumn[])
      }
      renderOption={option => (
        <div className={classes.conceptOption}>
          <div className={classes.nameId}>
            <Typography variant="body1">
              {`${option.attributes!.uiName} (${
                option.sort === "ASCENDING" ? "Ascending" : "Descending"
              })`}
            </Typography>
            <Typography variant="subtitle2" color="primary">
              {`${option.sort === "ASCENDING" ? "" : "-"}${option.id}`}
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
          size="small"
          variant="outlined"
          label="sort"
          helperText="Dimensions and Metrics to sort query by."
        />
      )}
    />
  )
}

export default Sort
