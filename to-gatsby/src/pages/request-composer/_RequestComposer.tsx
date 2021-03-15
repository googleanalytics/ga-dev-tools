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
import { makeStyles, Typography, Tabs, Tab, Box } from "@material-ui/core"
import ViewSelector, { HasView } from "../../components/ViewSelector"
import HistogramRequest from "./_HistogramRequest/_index"
import PivotRequest from "./_PivotRequest/_index"
import CohortRequest from "./_CohortRequest/_index"
import MetricExpression from "./_MetricExpression/_index"
import { StorageKey } from "../../constants"
import { useEffect } from "react"

const useStyles = makeStyles(_ => ({
  viewSelector: {
    flexDirection: "column",
    maxWidth: "650px",
  },
  maxControlWidth: {
    maxWidth: "600px",
  },
}))

// TODO - I think I want a min height that's at least as tall as the longest
// tab so far?
const TabPanel: React.FC<{ value: number; index: number }> = ({
  value,
  index,
  children,
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

// TODO - It'd be nice if this value could be initialized from the
// urlParameters, if present. This will be something to be careful about (if
// you want to be accurate over time) for the ga4 version of this demo because
// if we add new request types, we might not want to add them to the end.
const useTab = (): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [tab, setTab] = React.useState<number>(() => {
    let asString = window.localStorage.getItem(StorageKey.requestComposerTab)
    if (asString === null) {
      return 0
    }
    return parseInt(asString, 10)
  })

  useEffect(() => {
    window.localStorage.setItem(StorageKey.requestComposerTab, tab.toString())
  }, [tab])

  return [tab, setTab]
}

const RequestComposer = () => {
  const classes = useStyles()
  const [tab, setTab] = useTab()
  const [view, setView] = React.useState<HasView | undefined>()
  const onViewChanged = React.useCallback((view: HasView) => {
    setView(view)
  }, [])

  return (
    <>
      <section>
        <Typography variant="h3">Select View</Typography>
        <ViewSelector
          className={classes.viewSelector}
          variant="outlined"
          size="small"
          onViewChanged={onViewChanged}
        />
      </section>
      <section>
        <Tabs
          value={tab}
          onChange={(_e, newValue) => {
            // TODO - huh?
            setTab(newValue as any)
          }}
        >
          <Tab label="Histogram Request" />
          <Tab label="Pivot Request" />
          <Tab label="Cohort Request" />
          <Tab label="Metric Expression" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <HistogramRequest
            view={view}
            controlWidth={classes.maxControlWidth}
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PivotRequest view={view} controlWidth={classes.maxControlWidth} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <CohortRequest view={view} controlWidth={classes.maxControlWidth} />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <MetricExpression
            view={view}
            controlWidth={classes.maxControlWidth}
          />
        </TabPanel>
      </section>
    </>
  )
}

export default RequestComposer
