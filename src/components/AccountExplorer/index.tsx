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
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { useDebounce } from "use-debounce"

import ViewSelector from "@/components/ViewSelector"
import ViewsTable from "./ViewTable"
import useAccountPropertyView, {
  UAAccountPropertyView,
} from "../ViewSelector/useAccountPropertyView"
import { StorageKey } from "@/constants"
import useFlattenedViews from "../ViewSelector/useFlattenedViews"

const useStyles = makeStyles(theme => ({
  viewSelector: {
    marginBottom: theme.spacing(1),
  },
  section: {
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(3),
  },
  header: {
    margin: theme.spacing(0, 1, 0),
    padding: theme.spacing(0, 1, 0),
  },
  heading: {
    margin: theme.spacing(2),
    textAlign: "center",
  },
  search: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    padding: theme.spacing(0, 1, 0),
    // Search title Title
  },
  searchInput: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1),
    width: "100%",
    "max-width": theme.breakpoints.values.sm,
  },
  table: {
    "margin-top": theme.spacing(6),
  },
}))

const containsQuery = (
  searchQuery: string,
  apv: UAAccountPropertyView
): boolean => {
  const pattern = new RegExp(`(${searchQuery})`, "ig")
  const hasMatch =
    apv.account?.name?.match(pattern) ||
    apv.account?.id?.match(pattern) ||
    apv.property?.name?.match(pattern) ||
    apv.property?.id?.match(pattern) ||
    apv.view?.name?.match(pattern) ||
    apv.view?.id?.match(pattern)
  return !!hasMatch
}

enum QueryParam {
  Account = "a",
  Property = "b",
  View = "c",
}

const AccountExplorer = () => {
  const classes = useStyles()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 100, { trailing: true })
  const selectedAPV = useAccountPropertyView(
    StorageKey.accountExplorerAPV,
    QueryParam
  )

  const filterViews = React.useCallback(
    (fv: UAAccountPropertyView) => containsQuery(debouncedQuery, fv),
    [debouncedQuery]
  )

  const flattenedViewsRequest = useFlattenedViews(
    selectedAPV.account,
    selectedAPV.property,
    filterViews
  )

  return (
    <>
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        Use this tool to search or browse through your accounts, properties, and
        views, See what accounts you have access to, and find the IDs that you
        need for the API or for another tool or service that integrates with
        Google Analytics.
      </Typography>
      <Paper className={classes.paper}>
        <header className={classes.header}>
          <div className={classes.search}>
            <Typography variant="h3" className={classes.heading}>
              Search for your account information&hellip;
            </Typography>
            <TextField
              className={classes.searchInput}
              placeholder="Start typing to search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Typography variant="h3" className={classes.heading}>
              &hellip;or browse through all your accounts
            </Typography>
            <ViewSelector
              {...selectedAPV}
              variant="outlined"
              size="small"
              className={classes.viewSelector}
            />
            <ViewsTable
              className={classes.table}
              flattenedViewsRequest={flattenedViewsRequest}
              search={debouncedQuery === "" ? undefined : debouncedQuery}
            />
          </div>
        </header>
      </Paper>
    </>
  )
}

export default AccountExplorer
