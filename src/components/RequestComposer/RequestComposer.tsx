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
import { useEffect, useState } from "react"

import Typography from "@material-ui/core/Typography"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import makeStyles from "@material-ui/core/styles/makeStyles"

import { StorageKey } from "@/constants"
import ViewSelector, { HasView } from "@/components/ViewSelector"
import { PAB } from "@/components/Buttons"
import PrettyJson, { shouldCollapseRequest } from "@/components/PrettyJson"
import HistogramRequest from "./HistogramRequest"
import PivotRequest from "./PivotRequest"
import CohortRequest from "./CohortRequest"
import MetricExpression from "./MetricExpression"
import ReportsTable from "./ReportsTable"
import { useMakeReportsRequest } from "./api"
import TabPanel from "../TabPanel"

const useStyles = makeStyles(theme => ({
  viewSelector: {
    flexDirection: "column",
    maxWidth: "650px",
  },
  maxControlWidth: {
    maxWidth: "600px",
  },
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

// TODO - The Select Singles don't work correctly with SSR, but there's likely
// a fix somewhere that someone has done already. Look into it.
// TODO - It'd be nice if this value could be initialized from the
// urlParameters, if present. This will be something to be careful about (if
// you want to be accurate over time) for the ga4 version of this demo because
// if we add new request types, we might not want to add them to the end.
const useTab = (): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [tab, setTab] = React.useState<number>(() => {
    if (typeof window === "undefined") {
      return 0
    }
    let asString = window.localStorage.getItem(StorageKey.requestComposerTab)
    if (asString === null) {
      return 0
    }
    return parseInt(asString, 10)
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(StorageKey.requestComposerTab, tab.toString())
  }, [tab])

  return [tab, setTab]
}

export type ReportRequest = gapi.client.analyticsreporting.ReportRequest
export type ReportsRequest = { reportRequests: Array<ReportRequest> }

const RequestComposer = () => {
  const classes = useStyles()
  const [tab, setTab] = useTab()
  const [requestObject, setRequestObject] = useState<ReportsRequest>()
  const [view, setView] = React.useState<HasView | undefined>()
  const {
    makeRequest,
    response,
    longRequest,
    canMakeRequest,
  } = useMakeReportsRequest(requestObject)

  const button = React.useMemo(() => {
    return (
      <PAB
        variant="contained"
        color="primary"
        disabled={!canMakeRequest}
        onClick={makeRequest}
        className={classes.makeRequest}
      >
        Make Request
      </PAB>
    )
  }, [classes, makeRequest, canMakeRequest])

  const onViewChanged = React.useCallback(view => {
    if ([view.account, view.property, view.view].every(a => a !== undefined)) {
      setView(view as HasView)
    }
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
            setRequestObject={setRequestObject}
          >
            {button}
          </HistogramRequest>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PivotRequest
            view={view}
            controlWidth={classes.maxControlWidth}
            setRequestObject={setRequestObject}
          >
            {button}
          </PivotRequest>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <CohortRequest
            view={view}
            controlWidth={classes.maxControlWidth}
            setRequestObject={setRequestObject}
          >
            {button}
          </CohortRequest>
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <MetricExpression
            view={view}
            controlWidth={classes.maxControlWidth}
            setRequestObject={setRequestObject}
          >
            {button}
          </MetricExpression>
        </TabPanel>
      </section>

      <section className={classes.viewSelector}>
        <PrettyJson
          tooltipText="copy request"
          object={requestObject}
          shouldCollapse={shouldCollapseRequest}
        />
      </section>
      <section className={classes.viewSelector}>
        <ReportsTable response={response} longRequest={longRequest} />
      </section>
    </>
  )
}

export default RequestComposer
