// Copyright 2019 Google Inc. All rights reserved.
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

import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import Clear from "@material-ui/icons/Clear"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useDebounce } from "use-debounce"

import { StorageKey } from "@/constants"
import { WithEtag, Dispatch } from "@/types"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import {
  usePersistantObject,
  usePersistentBoolean,
  usePersistentString,
} from "../../hooks"
import { Column, useApi } from "../../api"
import ColumnGroupList from "./ColumnGroupList"
import useAnchorRedirects from "./useAnchorRedirects"

type ColumnAPIResponse = WithEtag<Column[]>

const useColumns = (): Column[] | undefined => {
  const api = useApi()
  const [columns, setColumns] = usePersistantObject<ColumnAPIResponse>(
    StorageKey.dimensionsMetricsExplorerColumns
  )

  React.useEffect(() => {
    if (api === undefined) {
      return
    }

    api.metadata.columns.list({ reportType: "ga" }).then(response => {
      const nu = response.result
      if (nu.etag === columns?.etag) {
        return
      }
      setColumns({ etag: nu.etag!, value: nu.items! })
    })
  }, [api, setColumns, columns])

  return columns?.value
}

const useStyles = makeStyles(theme => ({
  search: {
    display: "flex",
    flexDirection: "column",
    "&> label": {
      margin: theme.spacing(0),
      marginTop: theme.spacing(-0.5),
      marginBottom: theme.spacing(-1),
    },
  },
  searchInput: {
    maxWidth: theme.spacing(60),
  },
}))

const Search: React.FC<{
  searchText: string | undefined
  setSearchText: Dispatch<string | undefined>
  onlySegments: boolean
  setOnlySegments: Dispatch<boolean>
  allowDeprecated: boolean
  setAllowDeprecated: Dispatch<boolean>
}> = ({
  searchText,
  setSearchText,
  onlySegments,
  setOnlySegments,
  allowDeprecated,
  setAllowDeprecated,
}) => {
  const classes = useStyles()
  return (
    <section className={classes.search}>
      <TextField
        className={classes.searchInput}
        variant="outlined"
        size="small"
        placeholder="Search"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setSearchText("")}>
              <Clear />
            </IconButton>
          ),
        }}
      />
      <LabeledCheckbox checked={onlySegments} setChecked={setOnlySegments}>
        Only show fields that are allowed in segments
      </LabeledCheckbox>
      <LabeledCheckbox
        checked={allowDeprecated}
        setChecked={setAllowDeprecated}
      >
        Include deprecated fields
      </LabeledCheckbox>
    </section>
  )
}

const Explorer: React.FC = () => {
  const [searchText, setSearchText] = usePersistentString(
    StorageKey.dimensionsMetricsExplorerSearch,
    ""
  )
  const [allowDeprecated, setAllowDeprecated] = usePersistentBoolean(
    StorageKey.dimensionsMetricsExplorerAllowDeprecated,
    false
  )
  const [onlySegments, setOnlySegments] = usePersistentBoolean(
    StorageKey.dimensionsMetricsExplorerOnlySegments,
    false
  )

  const searchTerms = React.useMemo(
    () =>
      searchText
        ?.toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 0),
    [searchText]
  )

  const [throttledSearch] = useDebounce(searchTerms, 100, { trailing: true })

  const columns = useColumns()

  useAnchorRedirects(columns)

  return (
    <div>
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        allowDeprecated={allowDeprecated}
        setAllowDeprecated={setAllowDeprecated}
        onlySegments={onlySegments}
        setOnlySegments={setOnlySegments}
      />
      {columns !== undefined ? (
        <ColumnGroupList
          searchTerms={throttledSearch || []}
          allowDeprecated={allowDeprecated}
          onlySegments={onlySegments}
          columns={columns}
        />
      ) : (
        <div>Loading dimensions and metrics...</div>
      )}
    </div>
  )
}

export default Explorer
