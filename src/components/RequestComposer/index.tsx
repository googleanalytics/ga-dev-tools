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

import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"

import ExternalLink from "@/components/ExternalLink"
import Tool from "./RequestComposer"

const useStyles = makeStyles(theme => ({
  list: {
    marginTop: theme.spacing(0),
  },
}))

export enum RequestComposerType {
  Histogram = "histogram",
  Pivot = "pivot",
  Cohort = "cohort",
  MetricExpression = "metric-expression",
}

interface RequestComposerProps {
  type: RequestComposerType
}

const RequestComposer: React.FC<RequestComposerProps> = ({ type }) => {
  const classes = useStyles()
  return (
    <>
      <Typography variant="h3">Overview</Typography>
      <Typography>
        The Request Composer demonstrates how to compose the following Analytics
        Reporting API v4 requests and visualize their responses:
      </Typography>
      <ul className={classes.list}>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/basics#histogram_buckets">
            Histogram request
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/advanced#pivots">
            Pivot request
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/advanced#cohorts">
            Cohort request
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/basics#expressions">
            metric expressions
          </ExternalLink>
        </li>
      </ul>

      <Typography>
        This version of Request Composer does not support the following
        features:
      </Typography>
      <ul className={classes.list}>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/basics#multiple_date_ranges">
            multiple date ranges
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/basics#segments">
            advanced segment configuration
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/core/v4/basics#filtering_1">
            advanced filter configuration
          </ExternalLink>
        </li>
      </ul>

      <Typography>To compose a request:</Typography>
      <ol className={classes.list}>
        <li>Select an account, a property, and a view.</li>
        <li>Select a request type (Histogram, Pivot, or Cohort).</li>
        <li>Set query parameters.</li>
        <li>Click Make Request.</li>
      </ol>

      <Tool type={type} />
    </>
  )
}

export default RequestComposer
