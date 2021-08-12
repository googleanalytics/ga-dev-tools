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
import { useState } from "react"

import Typography from "@material-ui/core/Typography"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import makeStyles from "@material-ui/core/styles/makeStyles"

import { StorageKey } from "@/constants"
import ViewSelector from "@/components/ViewSelector"
import { PAB } from "@/components/Buttons"
import PrettyJson, { shouldCollapseRequest } from "@/components/PrettyJson"
import HistogramRequest from "./HistogramRequest"
import PivotRequest from "./PivotRequest"
import CohortRequest from "./CohortRequest"
import MetricExpression from "./MetricExpression"
import ReportsTable from "./ReportsTable"
import { useMakeReportsRequest } from "./api"
import TabPanel from "../TabPanel"
import { RequestComposerType } from "."
import useAccountPropertyView from "../ViewSelector/useAccountPropertyView"
import { navigate } from "gatsby"

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

export type ReportRequest = gapi.client.analyticsreporting.ReportRequest
export type ReportsRequest = { reportRequests: Array<ReportRequest> }

export enum QueryParam {
  Account = "a",
  Property = "b",
  View = "c",
  Dimensions = "d",
  Metrics = "e",
  Segment = "f",
  PivotMetrics = "g",
  PivotDimensions = "h",
  Metric = "i",
}

interface RequestComposerProps {
  type: RequestComposerType
}

const RequestComposer: React.FC<RequestComposerProps> = ({ type }) => {
  const classes = useStyles()
  const tab = React.useMemo(() => {
    switch (type) {
      case RequestComposerType.Histogram:
        return 0
      case RequestComposerType.Pivot:
        return 1
      case RequestComposerType.Cohort:
        return 2
      case RequestComposerType.MetricExpression:
        return 3
    }
  }, [type])

  const pathForIdx = React.useCallback((idx: number) => {
    switch (idx) {
      case 0:
        return `/request-composer/`
      case 1:
        return `/request-composer/pivot/`
      case 2:
        return `/request-composer/cohort/`
      case 3:
        return `/request-composer/metric-expression/`
      default:
        throw new Error("No matching idx")
    }
  }, [])
  const [requestObject, setRequestObject] = useState<ReportsRequest>()

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

  const accountPropertyView = useAccountPropertyView(
    StorageKey.requestComposerAPV,
    QueryParam
  )

  return (
    <>
      <section>
        <Typography variant="h3">Select View</Typography>
        <ViewSelector
          {...accountPropertyView}
          autoFill
          className={classes.viewSelector}
          variant="outlined"
          size="small"
        />
      </section>
      <section>
        <Tabs
          value={tab}
          onChange={(_e, newValue) => {
            const path = `${pathForIdx(newValue)}`
            navigate(path)
          }}
        >
          <Tab label="Histogram Request" />
          <Tab label="Pivot Request" />
          <Tab label="Cohort Request" />
          <Tab label="Metric Expression" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <HistogramRequest
            apv={accountPropertyView}
            controlWidth={classes.maxControlWidth}
            setRequestObject={setRequestObject}
          >
            {button}
          </HistogramRequest>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PivotRequest
            apv={accountPropertyView}
            controlWidth={classes.maxControlWidth}
            setRequestObject={setRequestObject}
          >
            {button}
          </PivotRequest>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <CohortRequest
            apv={accountPropertyView}
            controlWidth={classes.maxControlWidth}
            setRequestObject={setRequestObject}
          >
            {button}
          </CohortRequest>
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <MetricExpression
            apv={accountPropertyView}
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
