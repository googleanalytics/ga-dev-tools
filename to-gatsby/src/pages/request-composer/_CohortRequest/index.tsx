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
import { HasView } from "../../../components/ViewSelector"
import {
  Column,
  useDimensionsAndMetrics,
  useAnalyticsReportingAPI,
} from "../_api"
// TODO - ReportTable should be a general component for this Demo.
import { linkFor, titleFor, ReportTable } from "../_HistogramRequest"
import ExternalLink from "../../../components/ExternalLink"
import {
  TextField,
  Typography,
  Button,
  makeStyles,
  useTheme,
} from "@material-ui/core"
import { FancyOption } from "../../../components/FancyOption"
import { StorageKey } from "../../../constants"
import SelectSingle from "../../../components/SelectSingle"
import useCohortRequestParameters from "./_useCohortRequestParameters"
import useCohortRequest from "./_useCohortRequest"
import { GetReportsResponse } from "../../../api"
import Loader from "react-loader-spinner"

interface CohortRequestProps {
  view: HasView | undefined
  controlWidth: string
}

const useStyles = makeStyles(theme => ({
  // TODO - The loading indictor should be abstracted away for general use.
  loadingIndicator: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

const CohortRequest: React.FC<CohortRequestProps> = ({
  view,
  controlWidth,
}) => {
  const {
    viewId,
    setViewId,
    selectedMetric,
    setSelectedMetric,
    cohortSize,
  } = useCohortRequestParameters(view)
  const classes = useStyles()
  const theme = useTheme()
  const requestObject = useCohortRequest({ viewId, selectedMetric, cohortSize })
  console.log({ requestObject })
  // TODO - perf improvement - this should probably be passed down from the
  // parent instead of done for each one?
  const { metrics } = useDimensionsAndMetrics()
  const reportingAPI = useAnalyticsReportingAPI()
  const [reportsResponse, setReportsResponse] = useState<GetReportsResponse>()
  const [longRequest, setLongRequest] = useState(false)

  const makeRequest = React.useCallback(() => {
    if (reportingAPI === undefined || requestObject === undefined) {
      return
    }
    ;(async () => {
      const first = await Promise.race<string>([
        (async () => {
          const response = await reportingAPI.reports.batchGet(
            {},
            requestObject
          )
          setReportsResponse(response.result)
          // TODO - this could be more nuianced, but this is good enough for
          // now. This makes it where for requests that take longer than 300ms,
          // the loader shows up for at least 500ms so it's not as jumpy.
          setTimeout(() => {
            setLongRequest(false)
          }, 500)
          return "API"
        })(),
        new Promise<string>(resolve => {
          window.setTimeout(() => {
            resolve("TIMEOUT")
          }, 300)
        }),
      ])
      if (first === "TIMEOUT") {
        setLongRequest(true)
      }
    })()
  }, [reportingAPI, requestObject])
  return (
    <>
      <section className={controlWidth}>
        <TextField
          InputProps={{
            endAdornment: (
              <ExternalLink
                href={linkFor("ReportRequest.FIELDS.view_id")}
                title={titleFor("viewId")}
              />
            ),
          }}
          size="small"
          variant="outlined"
          fullWidth
          label="viewId"
          value={viewId}
          onChange={e => setViewId(e.target.value)}
          required
          helperText="The analytics view ID from which to retrieve data."
        />

        <SelectSingle<Column>
          options={metrics || []}
          getOptionLabel={column => column.id!}
          label="Cohort Metric"
          helperText="The metrics to include in the request."
          renderOption={column => (
            <FancyOption
              right={
                <Typography variant="subtitle1" color="textSecondary">
                  {column.attributes!.group}
                </Typography>
              }
            >
              <Typography variant="body1">
                {column.attributes!.uiName}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                {column.id}
              </Typography>
            </FancyOption>
          )}
          onSelectedChanged={setSelectedMetric}
          serializer={column => ({
            key: StorageKey.cohortRequestMetric,
            serialized: JSON.stringify(column),
          })}
          deserializer={(s: string) => {
            if (s === "undefined" || s === "null") {
              return undefined
            }
            return JSON.parse(s)
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={makeRequest}
          className={classes.makeRequest}
        >
          Make Request
        </Button>
      </section>

      {longRequest && (
        <section className={classes.loadingIndicator}>
          <Loader type="Circles" color={theme.palette.primary.main} />
          <Typography>Loading...</Typography>
        </section>
      )}
      <ReportTable response={reportsResponse} />
    </>
  )
}

export default CohortRequest
