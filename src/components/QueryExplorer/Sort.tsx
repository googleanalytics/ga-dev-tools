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

import { SortableColumn } from "."
import { Dispatch } from "@/types"
import { Column } from "@/types/ua"

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
  sort: SortableColumn[] | undefined
  setSortIDs: Dispatch<string[] | undefined>
}

const Sort: React.FC<SortProps> = ({ columns, sort, setSortIDs }) => {
  const classes = useStyles()
  const sortableColumns = React.useMemo<SortableColumn[]>(
    () =>
      columns
        .filter(column => {
          if (sort === undefined) {
            return true
          }
          return sort.find(s => s.id === column.id) === undefined
        })
        // Create and ascending and descending option for every column.
        .flatMap(column => [
          { ...column, sort: "ASCENDING" },
          { ...column, sort: "DESCENDING" },
        ]),

    [columns, sort]
  )

  // When the available columns change, filter out any values that are no
  // longer valid.
  React.useEffect(() => {
    if (sort === undefined) {
      return
    }
    const nuSort = sort.filter(column => columns.find(c => column.id === c.id))
    if (sort.length !== nuSort.length) {
      setSortIDs(nuSort.map(s => `${s.id}@@@${s.sort}`))
    }
  }, [columns, sort, setSortIDs])

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
      filterOptions={a =>
        a.filter(column => sort?.find(c => c.id === column.id) === undefined)
      }
      getOptionLabel={option =>
        `${option.sort === "ASCENDING" ? "" : "-"}${option.id}`
      }
      getOptionSelected={(a, b) => a.id === b.id && a.sort === b.sort}
      value={sort}
      onChange={(_event, value, _state) =>
        setSortIDs((value as SortableColumn[]).map(s => `${s.id}@@@${s.sort}`))
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
