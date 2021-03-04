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
import HistogramRequest from "./_HistogramRequest"
import PivotRequest from "./_PivotRequest"
import CohortRequest from "./_CohortRequest"
import MetricExpression from "./_MetricExpression"

// TODO - Talk to someone about how to make these look the right size without
// being completely arbitrary?
const useStyles = makeStyles(_ => ({
  viewSelector: {
    flexDirection: "column",
    // maxWidth: theme.spacing(63),
  },
  // panel: {
  //   maxWidth: theme.spacing(63),
  // },
}))

// TODO - I think I want a min width that's at least as tall as the longest tab
// so far?
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

const RequestComposer = () => {
  const classes = useStyles()
  const [tab, setTab] = React.useState(0)
  const [view, setView] = React.useState<HasView | undefined>()
  const onViewChanged = React.useCallback((view: HasView) => {
    setView(view)
  }, [])

  return (
    <>
      <section>
        <Typography variant="h4">Select account, property, and view</Typography>
        <ViewSelector
          className={classes.viewSelector}
          onViewChanged={onViewChanged}
        />
      </section>
      <section>
        <Tabs
          value={tab}
          onChange={(_e, newValue) => {
            setTab(newValue)
          }}
        >
          <Tab label="Histogram Request" />
          <Tab label="Pivot Request" />
          <Tab label="Cohort Request" />
          <Tab label="Metric Expression" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <HistogramRequest view={view} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PivotRequest />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <CohortRequest />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <MetricExpression />
        </TabPanel>
      </section>
    </>
  )
}

export default RequestComposer
