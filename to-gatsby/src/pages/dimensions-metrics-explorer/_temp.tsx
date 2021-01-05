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
import { Set } from "immutable"
import { useSelector } from "react-redux"

import { useLocalStorage, useTypedLocalStorage } from "../../hooks"
import { getAnalyticsApi, Column } from "../../api"

import { CubesByColumn, cubesByColumn, allCubes } from "./_cubes"

import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import Clear from "@material-ui/icons/Clear"
import ColumnGroupList from "./_ColumnGroupList"
import { AutoScrollProvider } from "../../components/AutoScroll"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const Main: React.FC = () => {
  const [searchText, setSearchText] = useLocalStorage("searchText", "")
  const [allowDeprecated, setAllowDeprecated] = useTypedLocalStorage(
    "allowDeprecated",
    false
  )
  const [onlySegments, setOnlySegments] = useTypedLocalStorage(
    "onlySegments",
    false
  )

  // If there is a fragment, reset the search filters, to ensure that
  // the column is definitely visible.
  React.useEffect(() => {
    if (window.location.hash) {
      setSearchText("")
      setAllowDeprecated(true)
      setOnlySegments(false)
    }
  }, [setAllowDeprecated, setOnlySegments, setSearchText])

  const searchTerms = React.useMemo(
    () =>
      searchText
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length),
    [searchText]
  )

  // Fetch all of the columns from the metadata API
  const [columns, setColumns] = React.useState<undefined | Column[]>(undefined)
  const gapi = useSelector((state: AppState) => state.gapi)

  React.useEffect(() => {
    if (gapi === undefined) {
      return
    }

    const api = getAnalyticsApi(gapi)
    api.metadata.columns.list({ reportType: "ga" }).then(response => {
      setColumns(response.result.items)
    })
  }, [gapi])

  // Fetch the cubes
  const [
    localCubesByColumn,
    setCubesByColumn,
  ] = React.useState<null | CubesByColumn>(null)
  React.useEffect(() => {
    cubesByColumn().then(cubes => setCubesByColumn(cubes))
  }, [])

  const [localAllCubes, setAllCubes] = React.useState<null | Set<string>>(null)
  React.useEffect(() => {
    allCubes().then(cubes => setAllCubes(cubes))
  }, [])

  return (
    <AutoScrollProvider behavior="auto" block="start">
      <div>
        <TextField
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
        <FormControlLabel
          control={
            <Checkbox
              checked={onlySegments}
              onChange={e => setOnlySegments(e.target.checked)}
            />
          }
          label="Only show fields that are allowed in segments"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={allowDeprecated}
              onChange={e => setAllowDeprecated(e.target.checked)}
            />
          }
          label="Include deprecated fields"
        />
        {localCubesByColumn !== null &&
        columns !== undefined &&
        localAllCubes !== null ? (
          <ColumnGroupList
            searchTerms={searchTerms}
            allowDeprecated={allowDeprecated}
            onlySegments={onlySegments}
            columns={columns}
            cubesByColumn={localCubesByColumn}
            allCubes={localAllCubes}
          />
        ) : (
          <div>Loading dimensions and metrics...</div>
        )}
      </div>
    </AutoScrollProvider>
  )
}

export default Main
