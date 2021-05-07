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

import ViewSelector, { HasView } from "@/components/ViewSelector"
import ViewsTable from "./ViewTable"
import useAllViews, { Views } from "./useAllViews"

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
    "max-width": theme.breakpoints.width("sm"),
  },
  table: {
    "margin-top": theme.spacing(6),
  },
}))

const containsQuery = (
  searchQuery: string,
  populatedView: HasView
): boolean => {
  const pattern = new RegExp(`(${searchQuery})`, "ig")
  const hasMatch =
    populatedView.account?.name?.match(pattern) ||
    populatedView.account?.id?.match(pattern) ||
    populatedView.property?.name?.match(pattern) ||
    populatedView.property?.id?.match(pattern) ||
    populatedView.view?.name?.match(pattern) ||
    populatedView.view?.id?.match(pattern)
  return !!hasMatch
}

const viewsForSearch = (
  searchQuery: string,
  populatedViews: HasView[]
): HasView[] => {
  return populatedViews.filter(populated =>
    containsQuery(searchQuery, populated)
  )
}

const populatedView = (view: Partial<HasView>): HasView | undefined => {
  if (
    view.account !== undefined &&
    view.property !== undefined &&
    view.view !== undefined
  ) {
    return view as HasView
  }
  return undefined
}

const AccountExplorer = () => {
  const classes = useStyles()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 100, { trailing: true })
  const [selectedView, setSelectedView] = React.useState<Partial<HasView>>({})
  const allViews = useAllViews()

  const filteredViews = React.useMemo<Views>(() => {
    if (populatedView(selectedView) !== undefined) {
      return [populatedView(selectedView)!]
    }
    // If allViews is defined
    if (Array.isArray(allViews)) {
      // If account or property is selected filter out views to only views with that property and view.
      const filtered = allViews
        .filter(view =>
          selectedView.account !== undefined
            ? selectedView.account.id === view.account.id
            : true
        )
        .filter(view =>
          selectedView.property !== undefined
            ? selectedView.property.id === view.property.id
            : true
        )
      // If there is a search, it should take priority
      if (debouncedQuery !== "") {
        return viewsForSearch(debouncedQuery, filtered)
      }
      return filtered
    } else {
      return allViews
    }
  }, [allViews, selectedView, debouncedQuery])

  const onViewChanged = React.useCallback(
    viewData => {
      setSelectedView(viewData)
    },
    [setSelectedView]
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
              variant="outlined"
              size="small"
              className={classes.viewSelector}
              onViewChanged={onViewChanged}
            />
            <ViewsTable
              className={classes.table}
              views={filteredViews}
              search={searchQuery === "" ? undefined : searchQuery}
            />
          </div>
        </header>
      </Paper>
    </>
  )
}

export default AccountExplorer
