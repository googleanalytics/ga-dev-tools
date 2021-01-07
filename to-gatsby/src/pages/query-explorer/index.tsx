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

import Layout from "../../components/layout"
import { Typography, TextField, makeStyles } from "@material-ui/core"
import { Url } from "../../constants"
import ViewSelector, { HasView } from "../../components/ViewSelector"

const coreReportingApi = <a href={Url.coreReportingApi}>Core Reporting API</a>

const useStyles = makeStyles(theme => ({
  inputs: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))

export const QueryExplorer = () => {
  const classes = useStyles()
  const [selectedView, setSelectedView] = React.useState<HasView>(undefined)
  const [view, setView] = React.useState("")

  // When the selected view is changed, update the text box for view with the
  // id.
  React.useEffect(() => {
    if (selectedView === undefined) {
      return
    }
    const viewId = `ga:${selectedView.view.id}`
    setView(viewId)
  }, [selectedView])

  return (
    <>
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        Sometimes you just need to explore. This tool lets you play with the{" "}
        {coreReportingApi} by building queries to get data from your Google
        Analytics views (profiles). You can use these queries in any of the
        client libraries to build your own tools.
      </Typography>
      <Typography variant="h3">Select View</Typography>
      <ViewSelector onViewChanged={setSelectedView} />
      <Typography variant="h3">Set query parameters</Typography>
      <section className={classes.inputs}>
        <TextField
          id="ids"
          value={view}
          onChange={e => setView(e.target.value)}
          label="ids"
        />
        <TextField id="start-date" label="start-date" />
        <TextField id="end-date" label="end-date" />
        <TextField id="metrics" label="metrics" />
        <TextField id="dimensions" label="dimensions" />
        <TextField id="sort" label="sort" />
        <TextField id="filters" label="filters" />
      </section>
    </>
  )
}

const Wrapped = () => {
  return (
    <Layout title="Query Explorer">
      <QueryExplorer />
    </Layout>
  )
}
export default Wrapped
