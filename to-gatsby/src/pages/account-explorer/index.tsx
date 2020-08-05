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

import Layout from "../../components/layout"
import ViewSelector, { HasView } from "../../components/ViewSelector"

import ViewsTable from "./_ViewTable"

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
  const lower = searchQuery.toLowerCase()
  const propertiesToCheck = [
    populatedView.account?.name?.toLowerCase(),
    populatedView.account?.id?.toLowerCase(),
    populatedView.property?.name?.toLowerCase(),
    populatedView.property?.id?.toLowerCase(),
    populatedView.view?.name?.toLowerCase(),
    populatedView.view?.id?.toLowerCase(),
  ]
  return (
    propertiesToCheck.find(
      property => property && property.indexOf(lower) !== -1
    ) !== undefined
  )
}

const viewsForSearch = (
  searchQuery: string,
  populatedViews: HasView[]
): HasView[] => {
  return populatedViews.filter(populated =>
    containsQuery(searchQuery, populated)
  )
}

export const AccountExplorer = () => {
  const classes = useStyles()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedView, setSelectedView] = React.useState<HasView>()
  const [allViews, setAllViews] = React.useState<HasView[]>([])
  const [filteredViews, setFilteredViews] = React.useState<HasView[]>([])

  // Whenever the selected view changes, if it is defined, the search should be
  // cleared & the table views set to the newly selected view.
  React.useEffect(() => {
    if (selectedView !== undefined) {
      setFilteredViews([selectedView])
      setSearchQuery("")
    }
  }, [selectedView])

  // When there is a search query, the views for the table should be the
  // filtered list. When there is no query, the value should be reset to the value
  // selected in the ViewSelector (if present)
  React.useEffect(() => {
    if (searchQuery !== "") {
      setFilteredViews(viewsForSearch(searchQuery, allViews))
    } else if (selectedView !== undefined) {
      setFilteredViews([selectedView])
    }
  }, [searchQuery, allViews])

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
            />
            <Typography variant="h3" className={classes.heading}>
              &hellip;or browse through all your accounts
            </Typography>
            <ViewSelector
              className={classes.viewSelector}
              onViewsChanged={populatedViews => {
                setAllViews(populatedViews)
              }}
              onViewChanged={viewData => {
                setSelectedView(viewData)
              }}
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

export default () => {
  return (
    <Layout title="Account Explorer" requireLogin>
      <AccountExplorer />
    </Layout>
  )
}
